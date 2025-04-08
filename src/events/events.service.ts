import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventItem } from './entities/event-item.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CampsService } from '../camps/camps.service';
import { ResultsService } from '../results/results.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(EventItem)
    private eventItemsRepository: Repository<EventItem>,
    private campsService: CampsService,
    @Inject(forwardRef(() => ResultsService))
    private resultsService: ResultsService,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const { campId, items, ...eventData } = createEventDto;

    // Find the referenced camp
    const camp = await this.campsService.findOne(campId);

    // Create the event
    const event = this.eventsRepository.create({
      ...eventData,
      camp,
    });

    // Save the event first to get an ID
    await this.eventsRepository.save(event);

    // Create and save event items
    const eventItems = items.map((item) =>
      this.eventItemsRepository.create({
        ...item,
        event,
      }),
    );

    event.items = await this.eventItemsRepository.save(eventItems);

    return event;
  }

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find({
      relations: ['camp', 'items'],
    });
  }

  async findByCamp(campId: number): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { camp: { id: campId } },
      relations: ['camp', 'items'],
    });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['camp', 'items', 'results'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    // Handle items update if provided
    if (updateEventDto.items) {
      // Instead of deleting all items, find which ones we need to keep
      // Get existing event items with their IDs and verify they're properly loaded
      const existingItems = await this.eventItemsRepository.find({
        where: { event: { id } },
        relations: ['event'],
      });

      // Log found items for debugging
      console.log(
        `Found ${existingItems.length} existing items for event ${id}`,
      );

      // Create a map of items from the DTO with their IDs (if they have one)
      const updatedItemsMap = new Map();
      updateEventDto.items.forEach((item) => {
        if (item.id) {
          updatedItemsMap.set(item.id, item);
        }
      });

      // Items to delete (existing items not in the update)
      const itemsToDelete = existingItems.filter(
        (item) => !updatedItemsMap.has(item.id),
      );

      // Items to update (existing items also in the update)
      const itemsToUpdate = existingItems.filter((item) =>
        updatedItemsMap.has(item.id),
      );

      // Items to create (items in update without IDs or with IDs not in existing items)
      const itemsToCreate = updateEventDto.items.filter(
        (item) =>
          !item.id ||
          !existingItems.some((existing) => existing.id === item.id),
      );

      try {
        // For items to delete, we need to check if they're referenced in results
        // Primero eliminamos las calificaciones asociadas a los items que se eliminarán
        if (itemsToDelete.length > 0) {
          console.log(
            `Attempting to delete ${itemsToDelete.length} items that are no longer needed`,
          );

          // Obtener los IDs de los items a eliminar
          const idsToDelete = itemsToDelete.map((item) => item.id);
          console.log(`Items to delete: ${idsToDelete.join(', ')}`);

          // Primero eliminamos todas las calificaciones (ResultItems) asociadas a estos EventItems
          for (const item of itemsToDelete) {
            try {
              // Eliminar ResultItems asociados a este EventItem
              await this.resultsService.deleteResultItemsByEventItem(item.id);
              console.log(
                `ResultItems del item ${item.id} eliminados correctamente`,
              );
            } catch (error) {
              console.error(
                `Error al eliminar ResultItems del item ${item.id}: ${error.message}`,
              );
            }
          }

          // Ahora podemos eliminar los EventItems sin problemas de restricciones foreign key
          try {
            const deleteResult =
              await this.eventItemsRepository.delete(idsToDelete);
            console.log(
              `Successfully deleted ${deleteResult.affected} event items`,
            );
          } catch (error) {
            console.error(`Error al eliminar EventItems: ${error.message}`);
          }
        }

        // Update existing items
        for (const item of itemsToUpdate) {
          const updateData = updatedItemsMap.get(item.id);
          if (updateData) {
            // Para evitar duplicados durante la actualización, solo copiamos propiedades específicas
            if (updateData.name) item.name = updateData.name;
            if (updateData.percentage !== undefined)
              item.percentage = updateData.percentage;
            // Añade aquí otras propiedades que puedan necesitar actualizarse
          }
        }

        if (itemsToUpdate.length > 0) {
          await this.eventItemsRepository.save(itemsToUpdate);
        }

        // Create new items
        if (itemsToCreate.length > 0) {
          const newItems = itemsToCreate.map((item) =>
            this.eventItemsRepository.create({
              ...item,
              event,
            }),
          );

          const savedNewItems = await this.eventItemsRepository.save(newItems);

          // Update the event's items array - ensure no duplicates by combining unique items
          const allEventItems = [...itemsToUpdate, ...savedNewItems];

          // We'll use a Map to deduplicate items by ID
          const uniqueItemsMap = new Map();
          for (const item of allEventItems) {
            uniqueItemsMap.set(item.id, item);
          }

          // Convert the map values back to an array
          event.items = Array.from(uniqueItemsMap.values());
        } else {
          event.items = [...itemsToUpdate];
        }
      } catch (error) {
        throw new Error(`Failed to update event items: ${error.message}`);
      }
    }

    // Handle camp update if campId is provided
    if (updateEventDto.campId) {
      const camp = await this.campsService.findOne(updateEventDto.campId);
      event.camp = camp;
    }

    // Update basic event properties
    const eventData = { ...updateEventDto };
    delete eventData.campId;
    delete eventData.items;
    Object.assign(event, eventData);

    return this.eventsRepository.save(event);
  }

  async remove(id: number): Promise<void> {
    const result = await this.eventsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }
}

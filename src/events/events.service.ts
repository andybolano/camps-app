import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventItem } from './entities/event-item.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CampsService } from '../camps/camps.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(EventItem)
    private eventItemsRepository: Repository<EventItem>,
    private campsService: CampsService,
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
      // Delete existing items
      await this.eventItemsRepository.delete({ event: { id } });

      // Create new items
      const eventItems = updateEventDto.items.map((item) =>
        this.eventItemsRepository.create({
          ...item,
          event,
        }),
      );

      event.items = await this.eventItemsRepository.save(eventItems);
    }

    // Handle camp update if campId is provided
    if (updateEventDto.campId) {
      const camp = await this.campsService.findOne(updateEventDto.campId);
      event.camp = camp;
    }

    // Update basic event properties
    const { ...eventData } = updateEventDto;
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

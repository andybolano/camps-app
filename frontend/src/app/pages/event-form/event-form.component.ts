import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EventService } from '../../services/event.service';
import { CampService } from '../../services/camp.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  campId!: number;
  eventId?: number;
  isEdit = false;
  isLoading = false;
  errorMessage = '';
  campName = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private campService: CampService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Obtener campId
    this.route.params.subscribe((params) => {
      this.campId = +params['campId'];
      this.eventId = params['id'] ? +params['id'] : undefined;
      this.isEdit = !!this.eventId;

      // Cargar datos del campamento
      this.loadCampData();

      // Si es edición, cargar datos del evento
      if (this.isEdit && this.eventId) {
        this.loadEventData(this.eventId);
      }
    });
  }

  private initForm(): void {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      items: this.fb.array([]),
    });
  }

  private loadCampData(): void {
    if (!this.campId) return;

    this.campService.getCamp(this.campId).subscribe({
      next: (camp) => {
        this.campName = camp.name;
      },
      error: (error) => {
        this.errorMessage = `Error al cargar datos del campamento: ${error.message}`;
      },
    });
  }

  private loadEventData(eventId: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.eventService.getEvent(eventId).subscribe({
      next: (event) => {
        // Actualizar el formulario con los datos del evento
        this.eventForm.patchValue({
          name: event.name,
          description: event.description,
        });

        // Cargar los items (categorías)
        if (event.items && event.items.length > 0) {
          // Limpiar el array primero
          this.clearItems();

          // Añadir cada item
          event.items.forEach((item) => {
            this.addItem(item.name, item.percentage);
          });
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Error al cargar el evento: ${error.message}`;
        this.isLoading = false;
      },
    });
  }

  get items(): FormArray {
    return this.eventForm.get('items') as FormArray;
  }

  addItem(name: string = '', percentage: number = 0): void {
    const itemForm = this.fb.group({
      name: [name, Validators.required],
      percentage: [
        percentage,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });

    this.items.push(itemForm);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  clearItems(): void {
    while (this.items.length !== 0) {
      this.items.removeAt(0);
    }
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Preparar datos en el formato que espera el backend
    const eventData = {
      ...this.eventForm.value,
      campId: this.campId,
    };

    // Enviar según sea creación o edición
    if (this.isEdit && this.eventId) {
      this.eventService.updateEvent(this.eventId, eventData).subscribe({
        next: () => {
          this.router.navigate(['/camps', this.campId, 'events']);
        },
        error: (error) => {
          // Mostrar el mensaje de error del backend cuando sea posible
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.error && typeof error.error === 'string') {
            this.errorMessage = error.error;
          } else if (error.message) {
            this.errorMessage = `Error al actualizar el evento: ${error.message}`;
          } else {
            this.errorMessage =
              'Error al actualizar el evento. Contacte al administrador.';
          }
          this.isLoading = false;

          // Desplazar la página hacia arriba para mostrar el mensaje de error
          window.scrollTo(0, 0);
        },
      });
    } else {
      this.eventService.createEvent(eventData).subscribe({
        next: () => {
          this.router.navigate(['/camps', this.campId, 'events']);
        },
        error: (error) => {
          // Mostrar el mensaje de error del backend cuando sea posible
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.error && typeof error.error === 'string') {
            this.errorMessage = error.error;
          } else if (error.message) {
            this.errorMessage = `Error al crear el evento: ${error.message}`;
          } else {
            this.errorMessage =
              'Error al crear el evento. Contacte al administrador.';
          }
          this.isLoading = false;

          // Desplazar la página hacia arriba para mostrar el mensaje de error
          window.scrollTo(0, 0);
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/camps', this.campId, 'events']);
  }
}

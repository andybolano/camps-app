import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EventService, Event } from '../../services/event.service';
import { ResultService, Result } from '../../services/result.service';
import { ClubService, Club } from '../../services/club.service';

@Component({
  selector: 'app-event-scoring',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './event-scoring.component.html',
  styleUrl: './event-scoring.component.scss',
})
export class EventScoringComponent implements OnInit {
  scoringForm!: FormGroup;
  event: Event | null = null;
  clubs: Club[] = [];
  campId!: number;
  eventId!: number;
  selectedClubId: number | null = null;
  existingResult: Result | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  totalScore = 0; // Puntuación total calculada
  eventResults: Result[] = []; // Resultados de todos los clubes para este evento
  currentRank = 0; // Ranking actual del club seleccionado

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private clubService: ClubService,
    private resultService: ResultService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe((params) => {
      this.campId = +params['campId'];
      this.eventId = +params['eventId'];

      // Cargar eventos y resultados independientemente de la selección de club
      Promise.all([this.loadEvent(), this.loadClubs()]).then(() => {
        // Cargar los resultados para mostrar el ranking
        this.loadEventResults();

        // Si ya hay un club seleccionado, verificar resultados existentes
        const clubId = this.scoringForm.get('clubId')?.value;
        if (clubId) {
          this.selectedClubId = clubId;
          this.checkExistingResult(this.eventId, clubId);
        }
      });
    });
  }

  private initForm(): void {
    this.scoringForm = this.fb.group({
      clubId: [null, Validators.required],
      scores: this.fb.array([]),
    });

    // Escuchar cambios en el club seleccionado
    this.scoringForm.get('clubId')?.valueChanges.subscribe((clubId) => {
      if (clubId) {
        this.selectedClubId = clubId;
        this.checkExistingResult(this.eventId, clubId);
        this.updateCurrentRank(); // Actualizar el ranking cuando cambia el club
      } else {
        this.selectedClubId = null;
        this.existingResult = null;
        this.totalScore = 0;
        this.currentRank = 0; // Reiniciar el ranking
      }
    });

    // Suscribirse a cambios en los puntajes para recalcular el total
    this.scoringForm.valueChanges.subscribe(() => {
      if (this.scoringForm.get('scores')) {
        this.calculateTotalScore();
      }
    });
  }

  private loadEvent(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    return new Promise<void>((resolve) => {
      this.eventService.getEvent(this.eventId).subscribe({
        next: (event) => {
          this.event = event;
          this.buildScoresForm();
          this.isLoading = false;
          resolve();
        },
        error: (error) => {
          this.errorMessage = `Error al cargar el evento: ${error.message}`;
          this.isLoading = false;
          resolve();
        },
      });
    });
  }

  private loadClubs(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.clubService.getClubsByCamp(this.campId).subscribe({
        next: (clubs) => {
          this.clubs = clubs;
          resolve();
        },
        error: (error) => {
          this.errorMessage = `Error al cargar los clubes: ${error.message}`;
          resolve();
        },
      });
    });
  }

  private buildScoresForm(): void {
    if (!this.event || !this.event.items || this.event.items.length === 0) {
      console.warn('No hay items para construir el formulario');
      return;
    }

    console.log('Construyendo formulario con items:', this.event.items);
    const scoresGroup = this.fb.group({});

    // Crear un control para cada ítem del evento
    this.event.items.forEach((item) => {
      console.log(
        `Añadiendo control para item id=${item.id}, nombre=${item.name}`,
      );
      scoresGroup.addControl(
        item.id!.toString(),
        this.fb.control(0, [
          Validators.required,
          Validators.min(0),
          Validators.max(10),
        ]),
      );
    });

    this.scoringForm.setControl('scores', scoresGroup);
    console.log('Formulario construido:', this.scoringForm.value);
  }

  private loadEventResults(): void {
    if (!this.eventId) return;

    this.resultService.getResultsByEventWithRanking(this.eventId).subscribe({
      next: (results) => {
        this.eventResults = results;
        console.log('Resultados del evento con ranking:', this.eventResults);
        this.updateCurrentRank();
      },
      error: (error) => {
        console.error('Error al cargar resultados del evento:', error);
      },
    });
  }

  private updateCurrentRank(): void {
    if (!this.selectedClubId || this.eventResults.length === 0) {
      this.currentRank = 0;
      return;
    }

    const result = this.eventResults.find(
      (r) => r.clubId === this.selectedClubId,
    );
    this.currentRank = result?.rank || 0;
  }

  private checkExistingResult(eventId: number, clubId: number): void {
    if (!eventId || !clubId) {
      console.warn(
        'No se pueden verificar resultados sin eventId y clubId válidos',
      );
      return;
    }

    if (!this.scoringForm || !this.scoringForm.get('scores')) {
      console.warn('El formulario aún no está completamente inicializado');
      // Intentar recargar cuando el formulario esté listo
      setTimeout(() => this.checkExistingResult(eventId, clubId), 500);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log(
      `Verificando resultados existentes para evento=${eventId}, club=${clubId}`,
    );
    this.resultService.getResultByEventAndClub(eventId, clubId).subscribe({
      next: (results) => {
        console.log('Resultados obtenidos:', results);
        if (results.length > 0) {
          this.existingResult = results[0];
          console.log('Result existente:', this.existingResult);
          this.updateCurrentRank();

          // Asegurarse de que el formulario esté listo antes de poblarlo
          setTimeout(() => {
            this.populateFormWithExistingResult();
            this.isLoading = false;
          }, 0);
        } else {
          this.existingResult = null;
          this.resetScores();
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error al verificar calificaciones:', error);
        this.errorMessage = `Error al verificar calificaciones existentes: ${error.message}`;
        this.isLoading = false;
      },
    });
  }

  private populateFormWithExistingResult(): void {
    if (!this.existingResult) {
      console.log('No hay resultado existente para cargar');
      return;
    }

    const scoresGroup = this.scoringForm.get('scores') as FormGroup;

    // Verificar si los datos vienen como 'scores' o como 'items'
    let scoreData = this.existingResult.scores || [];

    // Si no hay scores, intentar extraer la información de items directamente
    if (scoreData.length === 0 && (this.existingResult as any).items) {
      const items = (this.existingResult as any).items || [];
      console.log('Intentando extraer datos directamente de items:', items);

      // Mapear directamente la estructura del backend
      scoreData = items.map((item: any) => ({
        eventItemId: item.eventItem?.id || 0,
        score: item.score,
      }));
    }

    console.log('Datos de calificación procesados:', scoreData);

    if (!scoreData || !Array.isArray(scoreData) || scoreData.length === 0) {
      console.warn('No se encontraron datos de calificación válidos');
      return;
    }

    // Obtener los IDs de controles disponibles en el formulario
    const availableControls = Object.keys(scoresGroup.controls);
    console.log('Controles disponibles en el formulario:', availableControls);

    // Crear mapeo de puntuaciones por ID de item para facilitar búsqueda
    const scoreMap = new Map();

    // Almacenar las puntuaciones por ID de item (tanto string como number)
    scoreData.forEach((item: any) => {
      const eventItemId =
        item.eventItemId !== undefined
          ? item.eventItemId
          : item.eventItem?.id !== undefined
            ? item.eventItem.id
            : null;

      if (eventItemId !== null && item.score !== undefined) {
        console.log(
          `Mapeando calificación: itemId=${eventItemId}, score=${item.score}`,
        );
        scoreMap.set(eventItemId.toString(), item.score);
        scoreMap.set(Number(eventItemId), item.score);
      }
    });

    console.log('Mapa de puntuaciones:', [...scoreMap.entries()]);

    // Aplicar los valores a los controles del formulario
    availableControls.forEach((controlId) => {
      const control = scoresGroup.get(controlId);
      if (control) {
        // Intentar obtener el valor usando el ID como string
        if (scoreMap.has(controlId)) {
          const score = scoreMap.get(controlId);
          console.log(
            `Estableciendo puntuación ${score} para item ${controlId} (string match)`,
          );
          control.setValue(score);
        }
        // Intentar obtener el valor usando el ID como number
        else if (scoreMap.has(Number(controlId))) {
          const score = scoreMap.get(Number(controlId));
          console.log(
            `Estableciendo puntuación ${score} para item ${controlId} (number match)`,
          );
          control.setValue(score);
        } else {
          console.warn(`No se encontró puntuación para el item ${controlId}`);
        }
      }
    });

    // Verificar los valores del formulario después de poblar
    console.log('Formulario después de poblar:', this.scoringForm.value);

    // Después de poblar el formulario, calcular la puntuación total
    setTimeout(() => {
      this.calculateTotalScore();
    }, 0);
  }

  private resetScores(): void {
    if (!this.event || !this.event.items) {
      return;
    }

    const scoresGroup = this.scoringForm.get('scores') as FormGroup;

    // Restablecer todos los valores a 0
    this.event.items.forEach((item) => {
      const control = scoresGroup.get(item.id!.toString());
      if (control) {
        control.setValue(0);
      }
    });

    // Actualizar puntuación total
    this.totalScore = 0;
  }

  onSubmit(): void {
    if (this.scoringForm.invalid || !this.selectedClubId) {
      this.scoringForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const scoresGroup = this.scoringForm.get('scores') as FormGroup;
    const scores: any[] = [];

    // Convertir los valores del formulario en el formato esperado
    if (this.event && this.event.items) {
      this.event.items.forEach((item) => {
        const score = scoresGroup.get(item.id!.toString())?.value;
        if (score !== undefined) {
          scores.push({
            eventItemId: item.id,
            score: score,
          });
        }
      });
    }

    const resultData: Result = {
      eventId: this.eventId,
      clubId: this.selectedClubId,
      scores: scores,
      totalScore: this.totalScore, // Incluir la puntuación total calculada
    };

    // Actualizar o crear según sea necesario
    if (this.existingResult && this.existingResult.id) {
      this.resultService
        .updateResult(this.existingResult.id, resultData)
        .subscribe({
          next: () => {
            this.successMessage = 'Calificaciones guardadas exitosamente.';
            this.isLoading = false;
            this.loadEventResults(); // Recargar los resultados para actualizar el ranking
          },
          error: (error) => {
            this.errorMessage = `Error al guardar las calificaciones: ${error.message}`;
            this.isLoading = false;
          },
        });
    } else {
      this.resultService.createResult(resultData).subscribe({
        next: () => {
          this.successMessage = 'Calificaciones guardadas exitosamente.';
          this.isLoading = false;
          this.checkExistingResult(this.eventId, this.selectedClubId!);
          this.loadEventResults(); // Recargar los resultados para actualizar el ranking
        },
        error: (error) => {
          this.errorMessage = `Error al guardar las calificaciones: ${error.message}`;
          this.isLoading = false;
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/camps', this.campId, 'events']);
  }

  // Método para recargar manualmente las calificaciones existentes
  reloadExistingScores(): void {
    if (this.selectedClubId && this.eventId) {
      console.log('Recargando calificaciones para club', this.selectedClubId);
      this.checkExistingResult(this.eventId, this.selectedClubId);
    }
  }

  // Método para calcular la puntuación total
  calculateTotalScore(): void {
    if (!this.event || !this.event.items || this.event.items.length === 0) {
      this.totalScore = 0;
      return;
    }

    const scoresGroup = this.scoringForm.get('scores') as FormGroup;
    if (!scoresGroup) {
      this.totalScore = 0;
      return;
    }

    let totalScore = 0;
    let totalPercentage = 0;

    // Iterar sobre cada ítem del evento
    this.event.items.forEach((item) => {
      if (item.id && item.percentage) {
        const control = scoresGroup.get(item.id.toString());
        if (control && control.value !== null && control.value !== undefined) {
          // Calcular puntuación ponderada (calificación * porcentaje)
          const score = parseFloat(control.value);
          const percentage = item.percentage / 100; // Convertir porcentaje a decimal
          totalScore += score * percentage;
          totalPercentage += percentage;
        }
      }
    });

    // Normalizar si es necesario (en caso de que los porcentajes no sumen 100%)
    if (totalPercentage > 0 && Math.abs(totalPercentage - 1) > 0.01) {
      totalScore = totalScore / totalPercentage;
    }

    this.totalScore = totalScore;
    console.log('Puntuación total calculada:', this.totalScore);
  }

  // Método para obtener el sufijo del ranking (1st, 2nd, 3rd, etc.)
  getRankSuffix(rank: number): string {
    if (rank === 1) return 'er';
    if (rank === 2) return 'do';
    if (rank === 3) return 'er';
    return 'to';
  }

  // Método para obtener el nombre de un club por su ID
  getClubName(clubId: number | null): string {
    if (!clubId) return '';
    const club = this.clubs.find((c) => c.id === clubId);
    return club?.name || '';
  }

  // Método para obtener la clase CSS para la insignia de ranking
  getRankBadgeClass(rank: number | undefined): any {
    if (!rank) return 'bg-secondary';

    return {
      'bg-success': rank === 1,
      'bg-primary': rank === 2,
      'bg-info': rank === 3,
      'bg-secondary': rank > 3,
    };
  }
}

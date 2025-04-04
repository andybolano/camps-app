"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventScoringComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const router_1 = require("@angular/router");
const forms_1 = require("@angular/forms");
const event_service_1 = require("../../services/event.service");
const result_service_1 = require("../../services/result.service");
const club_service_1 = require("../../services/club.service");
let EventScoringComponent = class EventScoringComponent {
    constructor(fb, eventService, clubService, resultService, route, router) {
        this.fb = fb;
        this.eventService = eventService;
        this.clubService = clubService;
        this.resultService = resultService;
        this.route = route;
        this.router = router;
        this.event = null;
        this.clubs = [];
        this.selectedClubId = null;
        this.existingResult = null;
        this.isLoading = false;
        this.errorMessage = '';
        this.successMessage = '';
        this.totalScore = 0;
        this.eventResults = [];
        this.currentRank = 0;
    }
    ngOnInit() {
        this.initForm();
        this.route.params.subscribe((params) => {
            this.campId = +params['campId'];
            this.eventId = +params['eventId'];
            Promise.all([this.loadEvent(), this.loadClubs()]).then(() => {
                this.loadEventResults();
                const clubId = this.scoringForm.get('clubId')?.value;
                if (clubId) {
                    this.selectedClubId = clubId;
                    this.checkExistingResult(this.eventId, clubId);
                }
            });
        });
    }
    initForm() {
        this.scoringForm = this.fb.group({
            clubId: [null, forms_1.Validators.required],
            scores: this.fb.array([]),
        });
        this.scoringForm.get('clubId')?.valueChanges.subscribe((clubId) => {
            if (clubId) {
                this.selectedClubId = clubId;
                this.checkExistingResult(this.eventId, clubId);
                this.updateCurrentRank();
            }
            else {
                this.selectedClubId = null;
                this.existingResult = null;
                this.totalScore = 0;
                this.currentRank = 0;
            }
        });
        this.scoringForm.valueChanges.subscribe(() => {
            if (this.scoringForm.get('scores')) {
                this.calculateTotalScore();
            }
        });
    }
    loadEvent() {
        this.isLoading = true;
        this.errorMessage = '';
        return new Promise((resolve) => {
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
    loadClubs() {
        return new Promise((resolve) => {
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
    buildScoresForm() {
        if (!this.event || !this.event.items || this.event.items.length === 0) {
            console.warn('No hay items para construir el formulario');
            return;
        }
        console.log('Construyendo formulario con items:', this.event.items);
        const scoresGroup = this.fb.group({});
        this.event.items.forEach((item) => {
            console.log(`Añadiendo control para item id=${item.id}, nombre=${item.name}`);
            scoresGroup.addControl(item.id.toString(), this.fb.control(0, [
                forms_1.Validators.required,
                forms_1.Validators.min(0),
                forms_1.Validators.max(10),
            ]));
        });
        this.scoringForm.setControl('scores', scoresGroup);
        console.log('Formulario construido:', this.scoringForm.value);
    }
    loadEventResults() {
        if (!this.eventId)
            return;
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
    updateCurrentRank() {
        if (!this.selectedClubId || this.eventResults.length === 0) {
            this.currentRank = 0;
            return;
        }
        const result = this.eventResults.find((r) => r.clubId === this.selectedClubId);
        this.currentRank = result?.rank || 0;
    }
    checkExistingResult(eventId, clubId) {
        if (!eventId || !clubId) {
            console.warn('No se pueden verificar resultados sin eventId y clubId válidos');
            return;
        }
        if (!this.scoringForm || !this.scoringForm.get('scores')) {
            console.warn('El formulario aún no está completamente inicializado');
            setTimeout(() => this.checkExistingResult(eventId, clubId), 500);
            return;
        }
        this.isLoading = true;
        this.errorMessage = '';
        console.log(`Verificando resultados existentes para evento=${eventId}, club=${clubId}`);
        this.resultService.getResultByEventAndClub(eventId, clubId).subscribe({
            next: (results) => {
                console.log('Resultados obtenidos:', results);
                if (results.length > 0) {
                    this.existingResult = results[0];
                    console.log('Result existente:', this.existingResult);
                    this.updateCurrentRank();
                    setTimeout(() => {
                        this.populateFormWithExistingResult();
                        this.isLoading = false;
                    }, 0);
                }
                else {
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
    populateFormWithExistingResult() {
        if (!this.existingResult) {
            console.log('No hay resultado existente para cargar');
            return;
        }
        const scoresGroup = this.scoringForm.get('scores');
        let scoreData = this.existingResult.scores || [];
        if (scoreData.length === 0 && this.existingResult.items) {
            const items = this.existingResult.items || [];
            console.log('Intentando extraer datos directamente de items:', items);
            scoreData = items.map((item) => ({
                eventItemId: item.eventItem?.id || 0,
                score: item.score,
            }));
        }
        console.log('Datos de calificación procesados:', scoreData);
        if (!scoreData || !Array.isArray(scoreData) || scoreData.length === 0) {
            console.warn('No se encontraron datos de calificación válidos');
            return;
        }
        const availableControls = Object.keys(scoresGroup.controls);
        console.log('Controles disponibles en el formulario:', availableControls);
        const scoreMap = new Map();
        scoreData.forEach((item) => {
            const eventItemId = item.eventItemId !== undefined
                ? item.eventItemId
                : item.eventItem?.id !== undefined
                    ? item.eventItem.id
                    : null;
            if (eventItemId !== null && item.score !== undefined) {
                console.log(`Mapeando calificación: itemId=${eventItemId}, score=${item.score}`);
                scoreMap.set(eventItemId.toString(), item.score);
                scoreMap.set(Number(eventItemId), item.score);
            }
        });
        console.log('Mapa de puntuaciones:', [...scoreMap.entries()]);
        availableControls.forEach((controlId) => {
            const control = scoresGroup.get(controlId);
            if (control) {
                if (scoreMap.has(controlId)) {
                    const score = scoreMap.get(controlId);
                    console.log(`Estableciendo puntuación ${score} para item ${controlId} (string match)`);
                    control.setValue(score);
                }
                else if (scoreMap.has(Number(controlId))) {
                    const score = scoreMap.get(Number(controlId));
                    console.log(`Estableciendo puntuación ${score} para item ${controlId} (number match)`);
                    control.setValue(score);
                }
                else {
                    console.warn(`No se encontró puntuación para el item ${controlId}`);
                }
            }
        });
        console.log('Formulario después de poblar:', this.scoringForm.value);
        setTimeout(() => {
            this.calculateTotalScore();
        }, 0);
    }
    resetScores() {
        if (!this.event || !this.event.items) {
            return;
        }
        const scoresGroup = this.scoringForm.get('scores');
        this.event.items.forEach((item) => {
            const control = scoresGroup.get(item.id.toString());
            if (control) {
                control.setValue(0);
            }
        });
        this.totalScore = 0;
    }
    onSubmit() {
        if (this.scoringForm.invalid || !this.selectedClubId) {
            this.scoringForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';
        const scoresGroup = this.scoringForm.get('scores');
        const scores = [];
        if (this.event && this.event.items) {
            this.event.items.forEach((item) => {
                const score = scoresGroup.get(item.id.toString())?.value;
                if (score !== undefined) {
                    scores.push({
                        eventItemId: item.id,
                        score: score,
                    });
                }
            });
        }
        const resultData = {
            eventId: this.eventId,
            clubId: this.selectedClubId,
            scores: scores,
            totalScore: this.totalScore,
        };
        if (this.existingResult && this.existingResult.id) {
            this.resultService
                .updateResult(this.existingResult.id, resultData)
                .subscribe({
                next: () => {
                    this.successMessage = 'Calificaciones guardadas exitosamente.';
                    this.isLoading = false;
                    this.loadEventResults();
                },
                error: (error) => {
                    this.errorMessage = `Error al guardar las calificaciones: ${error.message}`;
                    this.isLoading = false;
                },
            });
        }
        else {
            this.resultService.createResult(resultData).subscribe({
                next: () => {
                    this.successMessage = 'Calificaciones guardadas exitosamente.';
                    this.isLoading = false;
                    this.checkExistingResult(this.eventId, this.selectedClubId);
                    this.loadEventResults();
                },
                error: (error) => {
                    this.errorMessage = `Error al guardar las calificaciones: ${error.message}`;
                    this.isLoading = false;
                },
            });
        }
    }
    goBack() {
        this.router.navigate(['/camps', this.campId, 'events']);
    }
    reloadExistingScores() {
        if (this.selectedClubId && this.eventId) {
            console.log('Recargando calificaciones para club', this.selectedClubId);
            this.checkExistingResult(this.eventId, this.selectedClubId);
        }
    }
    calculateTotalScore() {
        if (!this.event || !this.event.items || this.event.items.length === 0) {
            this.totalScore = 0;
            return;
        }
        const scoresGroup = this.scoringForm.get('scores');
        if (!scoresGroup) {
            this.totalScore = 0;
            return;
        }
        let totalScore = 0;
        let totalPercentage = 0;
        this.event.items.forEach((item) => {
            if (item.id && item.percentage) {
                const control = scoresGroup.get(item.id.toString());
                if (control && control.value !== null && control.value !== undefined) {
                    const score = parseFloat(control.value);
                    const percentage = item.percentage / 100;
                    totalScore += score * percentage;
                    totalPercentage += percentage;
                }
            }
        });
        if (totalPercentage > 0 && Math.abs(totalPercentage - 1) > 0.01) {
            totalScore = totalScore / totalPercentage;
        }
        this.totalScore = totalScore;
        console.log('Puntuación total calculada:', this.totalScore);
    }
    getRankSuffix(rank) {
        if (rank === 1)
            return 'er';
        if (rank === 2)
            return 'do';
        if (rank === 3)
            return 'er';
        return 'to';
    }
    getClubName(clubId) {
        if (!clubId)
            return '';
        const club = this.clubs.find((c) => c.id === clubId);
        return club?.name || '';
    }
    getRankBadgeClass(rank) {
        if (!rank)
            return 'bg-secondary';
        return {
            'bg-success': rank === 1,
            'bg-primary': rank === 2,
            'bg-info': rank === 3,
            'bg-secondary': rank > 3,
        };
    }
};
exports.EventScoringComponent = EventScoringComponent;
exports.EventScoringComponent = EventScoringComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-event-scoring',
        standalone: true,
        imports: [common_1.CommonModule, forms_1.ReactiveFormsModule, router_1.RouterLink],
        templateUrl: './event-scoring.component.html',
        styleUrl: './event-scoring.component.scss',
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        event_service_1.EventService,
        club_service_1.ClubService,
        result_service_1.ResultService,
        router_1.ActivatedRoute,
        router_1.Router])
], EventScoringComponent);
//# sourceMappingURL=event-scoring.component.js.map
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
        if (!this.event) {
            console.warn('No hay evento para construir el formulario');
            return;
        }
        console.log('Tipo de evento:', this.event.type);
        if (this.event.type === 'REGULAR') {
            this.buildRegularScoresForm();
        }
        else if (this.event.type === 'MEMBER_BASED') {
            this.buildMemberBasedScoresForm();
        }
        else {
            console.warn(`Tipo de evento desconocido: ${this.event.type}`);
        }
    }
    buildRegularScoresForm() {
        if (!this.event || !this.event.items || this.event.items.length === 0) {
            console.warn('No hay items regulares para construir el formulario');
            return;
        }
        console.log('Construyendo formulario con items regulares:', this.event.items);
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
        console.log('Formulario para items regulares construido:', this.scoringForm.value);
    }
    buildMemberBasedScoresForm() {
        if (!this.event ||
            !this.event.memberBasedItems ||
            this.event.memberBasedItems.length === 0) {
            console.warn('No hay items basados en miembros para construir el formulario');
            return;
        }
        console.log('Construyendo formulario con items basados en miembros:', this.event.memberBasedItems);
        const scoresGroup = this.fb.group({});
        this.scoringForm.setControl('scores', scoresGroup);
        const memberBasedScoresGroup = this.fb.group({});
        this.event.memberBasedItems.forEach((item) => {
            console.log(`Añadiendo control para item basado en miembros id=${item.id}, nombre=${item.name}`);
            const itemGroup = this.fb.group({
                matchCount: [0, [forms_1.Validators.required, forms_1.Validators.min(0)]],
                totalWithCharacteristic: [0, [forms_1.Validators.required, forms_1.Validators.min(0)]],
            });
            memberBasedScoresGroup.addControl(item.id.toString(), itemGroup);
        });
        this.scoringForm.setControl('memberBasedScores', memberBasedScoresGroup);
        console.log('Formulario para items basados en miembros construido:', this.scoringForm.value);
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
        if (!this.existingResult || !this.scoringForm)
            return;
        console.log('Intentando cargar resultado existente al formulario:', this.existingResult);
        const eventType = this.event?.type || 'REGULAR';
        if (eventType === 'REGULAR') {
            if (this.existingResult.scores && this.existingResult.scores.length > 0) {
                const scoresGroup = this.scoringForm.get('scores');
                if (!scoresGroup) {
                    console.error('No se encontró el grupo de scores en el formulario');
                    return;
                }
                this.existingResult.scores.forEach((score) => {
                    const control = scoresGroup.get(score.eventItemId.toString());
                    if (control) {
                        console.log(`Asignando valor ${score.score} al control del item ${score.eventItemId}`);
                        control.setValue(score.score);
                    }
                    else {
                        console.warn(`No se encontró el control para el item ${score.eventItemId}`);
                    }
                });
                this.calculateTotalScore();
            }
            else {
                console.warn('No hay scores en el resultado existente');
            }
        }
        else if (eventType === 'MEMBER_BASED') {
            if (this.existingResult.memberBasedScores &&
                this.existingResult.memberBasedScores.length > 0) {
                const memberBasedScoresGroup = this.scoringForm.get('memberBasedScores');
                if (!memberBasedScoresGroup) {
                    console.error('No se encontró el grupo de memberBasedScores en el formulario');
                    return;
                }
                this.existingResult.memberBasedScores.forEach((score) => {
                    const itemGroup = memberBasedScoresGroup.get(score.eventItemId.toString());
                    if (itemGroup) {
                        console.log(`Asignando valores matchCount=${score.matchCount}, totalWithCharacteristic=${score.totalWithCharacteristic} al item ${score.eventItemId}`);
                        itemGroup.get('matchCount')?.setValue(score.matchCount);
                        itemGroup
                            .get('totalWithCharacteristic')
                            ?.setValue(score.totalWithCharacteristic);
                    }
                    else {
                        console.warn(`No se encontró el grupo para el item basado en miembros ${score.eventItemId}`);
                    }
                });
                this.calculateTotalScore();
            }
            else {
                console.warn('No hay memberBasedScores en el resultado existente');
            }
        }
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
        if (this.scoringForm.invalid) {
            this.scoringForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';
        const eventType = this.event?.type || 'REGULAR';
        const clubId = this.scoringForm.get('clubId')?.value;
        const eventId = this.eventId;
        if (!clubId || !eventId) {
            this.errorMessage =
                'Debe seleccionar un club y un evento para calificar.';
            this.isLoading = false;
            return;
        }
        const totalScore = this.calculateTotalScore();
        const resultData = {
            clubId,
            eventId,
            totalScore,
        };
        if (eventType === 'REGULAR') {
            const scoresGroup = this.scoringForm.get('scores');
            const scores = [];
            if (scoresGroup) {
                Object.keys(scoresGroup.controls).forEach((itemId) => {
                    const control = scoresGroup.get(itemId);
                    if (control) {
                        scores.push({
                            eventItemId: +itemId,
                            score: parseFloat(control.value) || 0,
                        });
                    }
                });
            }
            resultData.scores = scores;
        }
        else if (eventType === 'MEMBER_BASED') {
            const memberBasedScoresGroup = this.scoringForm.get('memberBasedScores');
            const memberBasedScores = [];
            if (memberBasedScoresGroup) {
                Object.keys(memberBasedScoresGroup.controls).forEach((itemId) => {
                    const itemGroup = memberBasedScoresGroup.get(itemId);
                    if (itemGroup) {
                        memberBasedScores.push({
                            eventItemId: +itemId,
                            matchCount: parseFloat(itemGroup.get('matchCount')?.value) || 0,
                            totalWithCharacteristic: parseFloat(itemGroup.get('totalWithCharacteristic')?.value) ||
                                0,
                        });
                    }
                });
            }
            resultData.memberBasedScores = memberBasedScores;
        }
        console.log('Enviando datos de calificación:', resultData);
        if (this.existingResult && this.existingResult.id) {
            this.resultService
                .updateResult(this.existingResult.id, resultData)
                .subscribe({
                next: (result) => {
                    this.successMessage = 'Calificación actualizada correctamente.';
                    this.existingResult = result;
                    this.isLoading = false;
                    this.loadEventResults();
                },
                error: (error) => {
                    this.errorMessage = `Error al actualizar calificación: ${error.error?.message || error.message || error}`;
                    this.isLoading = false;
                },
            });
        }
        else {
            this.resultService.createResult(resultData).subscribe({
                next: (result) => {
                    this.successMessage = 'Calificación registrada correctamente.';
                    this.existingResult = result;
                    this.isLoading = false;
                    this.loadEventResults();
                },
                error: (error) => {
                    this.errorMessage = `Error al registrar calificación: ${error.error?.message || error.message || error}`;
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
        let total = 0;
        const eventType = this.event?.type || 'REGULAR';
        if (eventType === 'REGULAR') {
            if (this.event?.items &&
                this.event.items.length > 0 &&
                this.scoringForm) {
                const scoresGroup = this.scoringForm.get('scores');
                if (!scoresGroup) {
                    console.warn('No se encontró el grupo de scores en el formulario');
                    return 0;
                }
                for (const item of this.event.items) {
                    if (item.id) {
                        const control = scoresGroup.get(item.id.toString());
                        if (control) {
                            const score = parseFloat(control.value) || 0;
                            const percentage = item.percentage || 0;
                            const weightedScore = (score * percentage) / 100;
                            console.log(`Item ${item.id} (${item.name}): Score=${score}, Peso=${percentage}%, Ponderado=${weightedScore}`);
                            total += weightedScore;
                        }
                    }
                }
            }
        }
        else if (eventType === 'MEMBER_BASED') {
            if (this.event?.memberBasedItems &&
                this.event.memberBasedItems.length > 0 &&
                this.scoringForm) {
                const memberBasedScoresGroup = this.scoringForm.get('memberBasedScores');
                if (!memberBasedScoresGroup) {
                    console.warn('No se encontró el grupo de memberBasedScores en el formulario');
                    return 0;
                }
                for (const item of this.event.memberBasedItems) {
                    if (item.id) {
                        const itemGroup = memberBasedScoresGroup.get(item.id.toString());
                        if (itemGroup) {
                            const matchCount = parseFloat(itemGroup.get('matchCount')?.value) || 0;
                            const totalWithChar = parseFloat(itemGroup.get('totalWithCharacteristic')?.value) ||
                                0;
                            let proportion = 0;
                            if (totalWithChar > 0) {
                                proportion = matchCount / totalWithChar;
                            }
                            const score = proportion * 10;
                            const percentage = item.percentage || 0;
                            const weightedScore = (score * percentage) / 100;
                            console.log(`Item ${item.id} (${item.name}): MatchCount=${matchCount}, Total=${totalWithChar}, Proporción=${proportion}, Score=${score}, Peso=${percentage}%, Ponderado=${weightedScore}`);
                            total += weightedScore;
                        }
                    }
                }
            }
        }
        total = parseFloat(total.toFixed(2));
        console.log(`Puntuación total calculada: ${total}`);
        this.totalScore = total;
        return total;
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
    getItemPercentage(itemId) {
        if (!itemId) {
            return 0;
        }
        const memberBasedScoresGroup = this.scoringForm.get('memberBasedScores');
        if (!memberBasedScoresGroup) {
            return 0;
        }
        const itemGroup = memberBasedScoresGroup.get(itemId.toString());
        if (!itemGroup) {
            return 0;
        }
        const matchCount = parseFloat(itemGroup.get('matchCount')?.value) || 0;
        const totalWithChar = parseFloat(itemGroup.get('totalWithCharacteristic')?.value) || 0;
        if (totalWithChar === 0) {
            return 0;
        }
        const percentage = (matchCount / totalWithChar) * 100;
        return Math.round(percentage);
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
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
exports.ClubDetailComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const router_1 = require("@angular/router");
const club_service_1 = require("../../services/club.service");
const result_service_1 = require("../../services/result.service");
const camp_service_1 = require("../../services/camp.service");
const event_service_1 = require("../../services/event.service");
let ClubDetailComponent = class ClubDetailComponent {
    constructor(clubService, resultService, campService, eventService, route) {
        this.clubService = clubService;
        this.resultService = resultService;
        this.campService = campService;
        this.eventService = eventService;
        this.route = route;
        this.club = null;
        this.results = [];
        this.isLoading = true;
        this.errorMessage = '';
        this.currentResult = null;
        this.resultDetail = null;
    }
    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            const clubId = params.get('id');
            const campId = params.get('campId');
            if (clubId && campId) {
                this.clubId = +clubId;
                this.campId = +campId;
                this.loadClubData();
                this.loadClubResults();
            }
        });
    }
    ngAfterViewInit() {
        this.modal = new bootstrap.Modal(this.resultModal.nativeElement);
    }
    loadClubData() {
        this.isLoading = true;
        this.clubService.getClub(this.clubId).subscribe({
            next: (club) => {
                this.club = club;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = `Error al cargar datos del club: ${error.message}`;
                this.isLoading = false;
            },
        });
    }
    loadClubResults() {
        this.resultService.getResultsByClub(this.clubId).subscribe({
            next: (results) => {
                this.results = results;
                console.log('Resultados obtenidos:', results);
            },
            error: (error) => {
                this.errorMessage = `Error al cargar resultados: ${error.message}`;
            },
        });
    }
    showResultDetail(result) {
        this.currentResult = result;
        console.log('Mostrando detalle para resultado:', result);
        this.resultDetail = {
            eventName: result.event?.name || 'Evento desconocido',
            eventDate: result.event?.date,
            totalScore: result.totalScore || 0,
            rank: result.rank,
            items: [],
        };
        const eventId = result.eventId || result.event?.id;
        if (!eventId) {
            console.error('No se pudo determinar el ID del evento para este resultado:', result);
            this.resultDetail.items = [];
            this.openModal();
            return;
        }
        this.resultService.getResult(result.id).subscribe({
            next: (detailedResult) => {
                console.log('Resultado detallado obtenido:', detailedResult);
                const detailedEventId = detailedResult.eventId || result.event?.id || eventId;
                this.eventService.getEvent(detailedEventId).subscribe({
                    next: (event) => {
                        console.log('Evento obtenido:', event);
                        this.processItems(detailedResult, event);
                        this.openModal();
                    },
                    error: (error) => {
                        console.error('Error al cargar evento:', error);
                        this.openModal();
                    },
                });
            },
            error: (error) => {
                console.error('Error al cargar detalles del resultado:', error);
                this.eventService.getEvent(eventId).subscribe({
                    next: (event) => {
                        console.log('Evento obtenido (tras error):', event);
                        this.processItems(result, event);
                        this.openModal();
                    },
                    error: () => this.openModal(),
                });
            },
        });
    }
    processItems(result, event) {
        if (!this.resultDetail)
            return;
        console.log('Procesando items. Resultado:', result);
        console.log('Evento obtenido para procesar items:', event);
        if (!event.items || !Array.isArray(event.items)) {
            console.warn('El evento no tiene items definidos o no son un array:', event);
            this.resultDetail.items = [];
            return;
        }
        console.log('Items del evento:', event.items);
        let resultItems = [];
        if (result.items && Array.isArray(result.items)) {
            console.log('Usando items del resultado:', result.items);
            resultItems = result.items;
        }
        else if (result.scores && Array.isArray(result.scores)) {
            console.log('Usando scores del resultado:', result.scores);
            resultItems = result.scores;
        }
        const hasNestedEventItem = resultItems.length > 0 &&
            typeof resultItems[0] === 'object' &&
            'eventItem' in resultItems[0];
        console.log('Items tienen estructura anidada:', hasNestedEventItem);
        this.resultDetail.items = event.items.map((eventItem) => {
            let score = 0;
            if (hasNestedEventItem) {
                const matchingItem = resultItems.find((item) => item.eventItem && item.eventItem.id === eventItem.id);
                if (matchingItem)
                    score = matchingItem.score || 0;
            }
            else {
                const matchingItem = resultItems.find((item) => item.eventItemId === eventItem.id);
                if (matchingItem)
                    score = matchingItem.score || 0;
            }
            const percentage = eventItem.percentage || 0;
            const weightedScore = (score * percentage) / 100;
            return {
                name: eventItem.name || `Ítem ${eventItem.id}`,
                percentage: percentage,
                score: score,
                weightedScore: weightedScore,
            };
        });
        console.log('Items procesados para el modal:', this.resultDetail.items);
    }
    openModal() {
        if (this.modal) {
            this.modal.show();
        }
    }
    formatDate(dateString) {
        if (!dateString)
            return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
};
exports.ClubDetailComponent = ClubDetailComponent;
__decorate([
    (0, core_1.ViewChild)('resultModal'),
    __metadata("design:type", core_1.ElementRef)
], ClubDetailComponent.prototype, "resultModal", void 0);
exports.ClubDetailComponent = ClubDetailComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-club-detail',
        standalone: true,
        imports: [common_1.CommonModule, router_1.RouterLink, common_1.CurrencyPipe, common_1.DecimalPipe],
        templateUrl: './club-detail.component.html',
        styleUrl: './club-detail.component.scss',
    }),
    __metadata("design:paramtypes", [club_service_1.ClubService,
        result_service_1.ResultService,
        camp_service_1.CampService,
        event_service_1.EventService,
        router_1.ActivatedRoute])
], ClubDetailComponent);
//# sourceMappingURL=club-detail.component.js.map
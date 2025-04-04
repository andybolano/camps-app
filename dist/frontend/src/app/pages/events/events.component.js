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
exports.EventsComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const router_1 = require("@angular/router");
const event_service_1 = require("../../services/event.service");
let EventsComponent = class EventsComponent {
    constructor(eventService, route, router) {
        this.eventService = eventService;
        this.route = route;
        this.router = router;
        this.events = [];
        this.campId = 0;
        this.campName = '';
        this.isLoading = false;
        this.errorMessage = '';
    }
    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.campId = +params['campId'];
            this.loadEvents();
        });
    }
    loadEvents() {
        if (!this.campId) {
            this.errorMessage = 'ID de campamento no válido';
            return;
        }
        this.isLoading = true;
        this.errorMessage = '';
        this.eventService.getEventsByCampId(this.campId).subscribe({
            next: (events) => {
                this.events = events;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Error al cargar los eventos: ' + error.message;
                this.isLoading = false;
            },
        });
    }
    onDeleteEvent(id) {
        if (!confirm('¿Está seguro de que desea eliminar este evento?')) {
            return;
        }
        this.isLoading = true;
        this.eventService.deleteEvent(id).subscribe({
            next: () => {
                this.events = this.events.filter((event) => event.id !== id);
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Error al eliminar el evento: ' + error.message;
                this.isLoading = false;
            },
        });
    }
    goBack() {
        this.router.navigate(['/camps']);
    }
    getTotalPercentage(event) {
        if (!event.items || event.items.length === 0) {
            return 0;
        }
        return event.items.reduce((total, item) => total + (item.percentage || 0), 0);
    }
};
exports.EventsComponent = EventsComponent;
exports.EventsComponent = EventsComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-events',
        standalone: true,
        imports: [common_1.CommonModule, router_1.RouterLink, common_1.DatePipe],
        templateUrl: './events.component.html',
        styleUrl: './events.component.scss',
    }),
    __metadata("design:paramtypes", [event_service_1.EventService,
        router_1.ActivatedRoute,
        router_1.Router])
], EventsComponent);
//# sourceMappingURL=events.component.js.map
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
exports.EventFormComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const router_1 = require("@angular/router");
const forms_1 = require("@angular/forms");
const event_service_1 = require("../../services/event.service");
const camp_service_1 = require("../../services/camp.service");
let EventFormComponent = class EventFormComponent {
    constructor(fb, eventService, campService, route, router) {
        this.fb = fb;
        this.eventService = eventService;
        this.campService = campService;
        this.route = route;
        this.router = router;
        this.isEdit = false;
        this.isLoading = false;
        this.errorMessage = '';
        this.campName = '';
    }
    ngOnInit() {
        this.initForm();
        this.route.params.subscribe((params) => {
            this.campId = +params['campId'];
            this.eventId = params['id'] ? +params['id'] : undefined;
            this.isEdit = !!this.eventId;
            this.loadCampData();
            if (this.isEdit && this.eventId) {
                this.loadEventData(this.eventId);
            }
        });
    }
    initForm() {
        this.eventForm = this.fb.group({
            name: ['', [forms_1.Validators.required]],
            description: [''],
            items: this.fb.array([]),
        });
    }
    loadCampData() {
        if (!this.campId)
            return;
        this.campService.getCamp(this.campId).subscribe({
            next: (camp) => {
                this.campName = camp.name;
            },
            error: (error) => {
                this.errorMessage = `Error al cargar datos del campamento: ${error.message}`;
            },
        });
    }
    loadEventData(eventId) {
        this.isLoading = true;
        this.errorMessage = '';
        this.eventService.getEvent(eventId).subscribe({
            next: (event) => {
                this.eventForm.patchValue({
                    name: event.name,
                    description: event.description,
                });
                if (event.items && event.items.length > 0) {
                    this.clearItems();
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
    get items() {
        return this.eventForm.get('items');
    }
    addItem(name = '', percentage = 0) {
        const itemForm = this.fb.group({
            name: [name, forms_1.Validators.required],
            percentage: [
                percentage,
                [forms_1.Validators.required, forms_1.Validators.min(0), forms_1.Validators.max(100)],
            ],
        });
        this.items.push(itemForm);
    }
    removeItem(index) {
        this.items.removeAt(index);
    }
    clearItems() {
        while (this.items.length !== 0) {
            this.items.removeAt(0);
        }
    }
    onSubmit() {
        if (this.eventForm.invalid) {
            this.eventForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        this.errorMessage = '';
        const eventData = {
            ...this.eventForm.value,
            campId: this.campId,
        };
        if (this.isEdit && this.eventId) {
            this.eventService.updateEvent(this.eventId, eventData).subscribe({
                next: () => {
                    this.router.navigate(['/camps', this.campId, 'events']);
                },
                error: (error) => {
                    if (error.error && error.error.message) {
                        this.errorMessage = error.error.message;
                    }
                    else if (error.error && typeof error.error === 'string') {
                        this.errorMessage = error.error;
                    }
                    else if (error.message) {
                        this.errorMessage = `Error al actualizar el evento: ${error.message}`;
                    }
                    else {
                        this.errorMessage =
                            'Error al actualizar el evento. Contacte al administrador.';
                    }
                    this.isLoading = false;
                    window.scrollTo(0, 0);
                },
            });
        }
        else {
            this.eventService.createEvent(eventData).subscribe({
                next: () => {
                    this.router.navigate(['/camps', this.campId, 'events']);
                },
                error: (error) => {
                    if (error.error && error.error.message) {
                        this.errorMessage = error.error.message;
                    }
                    else if (error.error && typeof error.error === 'string') {
                        this.errorMessage = error.error;
                    }
                    else if (error.message) {
                        this.errorMessage = `Error al crear el evento: ${error.message}`;
                    }
                    else {
                        this.errorMessage =
                            'Error al crear el evento. Contacte al administrador.';
                    }
                    this.isLoading = false;
                    window.scrollTo(0, 0);
                },
            });
        }
    }
    cancel() {
        this.router.navigate(['/camps', this.campId, 'events']);
    }
};
exports.EventFormComponent = EventFormComponent;
exports.EventFormComponent = EventFormComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-event-form',
        standalone: true,
        imports: [common_1.CommonModule, forms_1.ReactiveFormsModule, router_1.RouterLink],
        templateUrl: './event-form.component.html',
        styleUrl: './event-form.component.scss',
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        event_service_1.EventService,
        camp_service_1.CampService,
        router_1.ActivatedRoute,
        router_1.Router])
], EventFormComponent);
//# sourceMappingURL=event-form.component.js.map
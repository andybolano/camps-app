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
var _a, _b, _c, _d, _e;
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
        this.eventTypes = [
            { value: 'REGULAR', label: 'Regular' },
            { value: 'MEMBER_BASED', label: 'Basado en Características de Miembros' },
        ];
        this.characteristicOptions = [
            { value: 'minorsCount', label: 'Menores' },
            { value: 'companionsCount', label: 'Acompañantes' },
            { value: 'participantsCount', label: 'Participantes' },
            { value: 'guestsCount', label: 'Invitados' },
            { value: 'economsCount', label: 'Ecónomos' },
        ];
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
            type: ['REGULAR', [forms_1.Validators.required]],
            items: this.fb.array([]),
            memberBasedItems: this.fb.array([]),
        });
        this.eventForm.get('type')?.valueChanges.subscribe((type) => {
            console.log('Event type changed to:', type);
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
                    type: event.type || 'REGULAR',
                });
                if (event.items && event.items.length > 0) {
                    this.clearItems();
                    event.items.forEach((item) => {
                        this.addItem(item.name, item.percentage);
                    });
                }
                if (event.memberBasedItems && event.memberBasedItems.length > 0) {
                    this.clearMemberBasedItems();
                    event.memberBasedItems.forEach((item) => {
                        this.addMemberBasedItem(item.name, item.percentage, item.applicableCharacteristics, item.calculationType, item.isRequired);
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
    get memberBasedItems() {
        return this.eventForm.get('memberBasedItems');
    }
    get eventType() {
        return this.eventForm.get('type')?.value;
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
    addMemberBasedItem(name = '', percentage = 0, applicableCharacteristics = [], calculationType = 'PROPORTION', isRequired = false) {
        const itemForm = this.fb.group({
            name: [name, forms_1.Validators.required],
            percentage: [
                percentage,
                [forms_1.Validators.required, forms_1.Validators.min(0), forms_1.Validators.max(100)],
            ],
            applicableCharacteristics: [
                applicableCharacteristics,
                [forms_1.Validators.required, forms_1.Validators.minLength(1)],
            ],
            calculationType: ['TOTAL', forms_1.Validators.required],
            isRequired: [isRequired],
        });
        this.memberBasedItems.push(itemForm);
    }
    removeItem(index) {
        this.items.removeAt(index);
    }
    removeMemberBasedItem(index) {
        this.memberBasedItems.removeAt(index);
    }
    clearItems() {
        while (this.items.length !== 0) {
            this.items.removeAt(0);
        }
    }
    clearMemberBasedItems() {
        while (this.memberBasedItems.length !== 0) {
            this.memberBasedItems.removeAt(0);
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
        if (eventData.type === 'REGULAR' &&
            (!eventData.items || eventData.items.length === 0)) {
            this.errorMessage =
                'Los eventos regulares requieren al menos un ítem de calificación.';
            this.isLoading = false;
            window.scrollTo(0, 0);
            return;
        }
        if (eventData.type === 'MEMBER_BASED' &&
            (!eventData.memberBasedItems || eventData.memberBasedItems.length === 0)) {
            this.errorMessage =
                'Los eventos basados en miembros requieren al menos un ítem basado en características.';
            this.isLoading = false;
            window.scrollTo(0, 0);
            return;
        }
        console.log('Enviando datos del evento:', eventData);
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
    addCharacteristic(index, value) {
        const mbItemForm = this.getMultiBranchItemAt(index);
        if (!mbItemForm)
            return;
        const characteristics = mbItemForm.get('applicableCharacteristics')?.value || [];
        if (!characteristics.includes(value)) {
            mbItemForm
                .get('applicableCharacteristics')
                ?.setValue([...characteristics, value]);
        }
    }
    removeCharacteristic(index, value) {
        const mbItemForm = this.getMultiBranchItemAt(index);
        if (!mbItemForm)
            return;
        const characteristics = mbItemForm.get('applicableCharacteristics')?.value || [];
        mbItemForm
            .get('applicableCharacteristics')
            ?.setValue(characteristics.filter((c) => c !== value));
    }
    isCharacteristicSelected(index, value) {
        const mbItemForm = this.getMultiBranchItemAt(index);
        if (!mbItemForm)
            return false;
        const characteristics = mbItemForm.get('applicableCharacteristics')?.value || [];
        return characteristics.includes(value);
    }
    onCharacteristicChange(event, index, value) {
        const target = event.target;
        if (target.checked) {
            this.addCharacteristic(index, value);
        }
        else {
            this.removeCharacteristic(index, value);
        }
    }
    getMultiBranchItemAt(index) {
        return this.eventForm?.get('memberBasedItems')
            ? this.eventForm.get('memberBasedItems').at(index)
            : null;
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
    __metadata("design:paramtypes", [typeof (_a = typeof forms_1.FormBuilder !== "undefined" && forms_1.FormBuilder) === "function" ? _a : Object, typeof (_b = typeof event_service_1.EventService !== "undefined" && event_service_1.EventService) === "function" ? _b : Object, typeof (_c = typeof camp_service_1.CampService !== "undefined" && camp_service_1.CampService) === "function" ? _c : Object, typeof (_d = typeof router_1.ActivatedRoute !== "undefined" && router_1.ActivatedRoute) === "function" ? _d : Object, typeof (_e = typeof router_1.Router !== "undefined" && router_1.Router) === "function" ? _e : Object])
], EventFormComponent);
//# sourceMappingURL=tmp.js.map
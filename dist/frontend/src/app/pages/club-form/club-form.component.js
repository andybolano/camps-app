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
exports.ClubFormComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const router_1 = require("@angular/router");
const club_service_1 = require("../../services/club.service");
const camp_service_1 = require("../../services/camp.service");
let ClubFormComponent = class ClubFormComponent {
    constructor(fb, clubService, campService, route, router) {
        this.fb = fb;
        this.clubService = clubService;
        this.campService = campService;
        this.route = route;
        this.router = router;
        this.isEditMode = false;
        this.campName = 'Cargando...';
        this.isLoading = false;
        this.errorMessage = '';
        this.debug = true;
    }
    ngOnInit() {
        this.initForm();
        this.route.paramMap.subscribe((params) => {
            const campId = params.get('campId');
            if (campId) {
                this.campId = +campId;
                this.loadCampData(this.campId);
                const id = params.get('id');
                if (id) {
                    this.isEditMode = true;
                    this.clubId = +id;
                    this.loadClubData(this.clubId);
                }
            }
        });
    }
    initForm() {
        this.clubForm = this.fb.group({
            name: ['', [forms_1.Validators.required]],
            city: ['', [forms_1.Validators.required]],
            participantsCount: [0, [forms_1.Validators.required, forms_1.Validators.min(0)]],
            guestsCount: [0, [forms_1.Validators.required, forms_1.Validators.min(0)]],
            minorsCount: [0, [forms_1.Validators.required, forms_1.Validators.min(0)]],
            economsCount: [0, [forms_1.Validators.required, forms_1.Validators.min(0)]],
            registrationFee: [0, [forms_1.Validators.required, forms_1.Validators.min(0)]],
            isPaid: [false],
        });
    }
    loadCampData(campId) {
        this.campService.getCamp(campId).subscribe({
            next: (camp) => {
                this.campName = camp.name;
            },
            error: (error) => {
                this.errorMessage =
                    'Error al cargar los datos del campamento: ' + error.message;
            },
        });
    }
    loadClubData(id) {
        this.isLoading = true;
        this.clubService.getClub(id).subscribe({
            next: (club) => {
                this.clubForm.setValue({
                    name: club.name,
                    city: club.city,
                    participantsCount: club.participantsCount,
                    guestsCount: club.guestsCount,
                    minorsCount: club.minorsCount || 0,
                    economsCount: club.economsCount,
                    registrationFee: club.registrationFee,
                    isPaid: club.isPaid,
                });
                if (club.shieldUrl) {
                    this.currentShield = club.shieldUrl;
                    console.log('URL del escudo cargada:', this.currentShield);
                }
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage =
                    'Error al cargar los datos del club: ' + error.message;
                this.isLoading = false;
            },
        });
    }
    onShieldChange(event) {
        const inputElement = event.target;
        if (inputElement.files && inputElement.files.length > 0) {
            this.shieldFile = inputElement.files[0];
            if (this.shieldPreview) {
                URL.revokeObjectURL(this.shieldPreview);
            }
            this.shieldPreview = URL.createObjectURL(this.shieldFile);
        }
    }
    clearShield() {
        this.shieldFile = undefined;
        if (this.shieldPreview) {
            URL.revokeObjectURL(this.shieldPreview);
            this.shieldPreview = undefined;
        }
    }
    onSubmit() {
        if (this.clubForm.invalid) {
            return;
        }
        this.isLoading = true;
        this.errorMessage = '';
        const formData = {
            ...this.clubForm.value,
            campId: this.campId,
        };
        console.log('Form isPaid value:', this.clubForm.get('isPaid')?.value);
        console.log('Form data to submit:', formData);
        if (this.isEditMode && this.clubId) {
            this.clubService
                .updateClub(this.clubId, formData, this.shieldFile)
                .subscribe({
                next: (updatedClub) => {
                    console.log('Club actualizado con isPaid:', updatedClub.isPaid);
                    this.isLoading = false;
                    this.router.navigate(['/camps', this.campId, 'clubs']);
                },
                error: (error) => {
                    this.errorMessage = 'Error al actualizar el club: ' + error.message;
                    this.isLoading = false;
                },
            });
        }
        else {
            this.clubService.createClub(formData, this.shieldFile).subscribe({
                next: (newClub) => {
                    console.log('Club creado con isPaid:', newClub.isPaid);
                    this.isLoading = false;
                    this.router.navigate(['/camps', this.campId, 'clubs']);
                },
                error: (error) => {
                    this.errorMessage = 'Error al crear el club: ' + error.message;
                    this.isLoading = false;
                },
            });
        }
    }
    onIsPaidChange(event) {
        const target = event.target;
        console.log('isPaid checkbox changed:', target.checked);
    }
    get name() {
        return this.clubForm.get('name');
    }
    get city() {
        return this.clubForm.get('city');
    }
    get participantsCount() {
        return this.clubForm.get('participantsCount');
    }
    get guestsCount() {
        return this.clubForm.get('guestsCount');
    }
    get minorsCount() {
        return this.clubForm.get('minorsCount');
    }
    get economsCount() {
        return this.clubForm.get('economsCount');
    }
    get registrationFee() {
        return this.clubForm.get('registrationFee');
    }
    get isPaid() {
        return this.clubForm.get('isPaid');
    }
};
exports.ClubFormComponent = ClubFormComponent;
exports.ClubFormComponent = ClubFormComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-club-form',
        standalone: true,
        imports: [common_1.CommonModule, forms_1.ReactiveFormsModule, router_1.RouterLink],
        templateUrl: './club-form.component.html',
        styleUrl: './club-form.component.scss',
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        club_service_1.ClubService,
        camp_service_1.CampService,
        router_1.ActivatedRoute,
        router_1.Router])
], ClubFormComponent);
//# sourceMappingURL=club-form.component.js.map
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
exports.CampFormComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const router_1 = require("@angular/router");
const camp_service_1 = require("../../services/camp.service");
let CampFormComponent = class CampFormComponent {
    constructor(fb, campService, route, router) {
        this.fb = fb;
        this.campService = campService;
        this.route = route;
        this.router = router;
        this.isEditMode = false;
        this.isLoading = false;
        this.errorMessage = '';
    }
    ngOnInit() {
        this.initForm();
        this.route.paramMap.subscribe((params) => {
            const id = params.get('id');
            if (id) {
                this.isEditMode = true;
                this.campId = +id;
                this.loadCampData(this.campId);
            }
        });
    }
    initForm() {
        this.campForm = this.fb.group({
            name: ['', [forms_1.Validators.required]],
            location: ['', [forms_1.Validators.required]],
            startDate: ['', [forms_1.Validators.required]],
            endDate: ['', [forms_1.Validators.required]],
            description: [''],
        });
    }
    loadCampData(id) {
        this.isLoading = true;
        this.campService.getCamp(id).subscribe({
            next: (camp) => {
                const startDate = camp.startDate
                    ? new Date(camp.startDate).toISOString().split('T')[0]
                    : '';
                const endDate = camp.endDate
                    ? new Date(camp.endDate).toISOString().split('T')[0]
                    : '';
                this.campForm.setValue({
                    name: camp.name,
                    location: camp.location,
                    startDate: startDate,
                    endDate: endDate,
                    description: camp.description || '',
                });
                if (camp.logoUrl) {
                    this.currentLogo = camp.logoUrl;
                    console.log('URL del logo cargada:', this.currentLogo);
                }
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage =
                    'Error al cargar los datos del campamento: ' + error.message;
                this.isLoading = false;
            },
        });
    }
    onLogoChange(event) {
        const inputElement = event.target;
        if (inputElement.files && inputElement.files.length > 0) {
            this.logoFile = inputElement.files[0];
            if (this.logoPreview) {
                URL.revokeObjectURL(this.logoPreview);
            }
            this.logoPreview = URL.createObjectURL(this.logoFile);
        }
    }
    onSubmit() {
        if (this.campForm.invalid) {
            return;
        }
        this.isLoading = true;
        this.errorMessage = '';
        const formData = this.campForm.value;
        if (this.isEditMode && this.campId) {
            this.campService
                .updateCamp(this.campId, formData, this.logoFile)
                .subscribe({
                next: () => {
                    this.isLoading = false;
                    this.router.navigate(['/camps']);
                },
                error: (error) => {
                    this.errorMessage =
                        'Error al actualizar el campamento: ' + error.message;
                    this.isLoading = false;
                },
            });
        }
        else {
            this.campService.createCamp(formData, this.logoFile).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.router.navigate(['/camps']);
                },
                error: (error) => {
                    this.errorMessage = 'Error al crear el campamento: ' + error.message;
                    this.isLoading = false;
                },
            });
        }
    }
    clearLogo() {
        this.logoFile = undefined;
        if (this.logoPreview) {
            URL.revokeObjectURL(this.logoPreview);
            this.logoPreview = undefined;
        }
    }
    get name() {
        return this.campForm.get('name');
    }
    get location() {
        return this.campForm.get('location');
    }
    get startDate() {
        return this.campForm.get('startDate');
    }
    get endDate() {
        return this.campForm.get('endDate');
    }
    get description() {
        return this.campForm.get('description');
    }
};
exports.CampFormComponent = CampFormComponent;
exports.CampFormComponent = CampFormComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-camp-form',
        standalone: true,
        imports: [common_1.CommonModule, forms_1.ReactiveFormsModule, router_1.RouterLink],
        templateUrl: './camp-form.component.html',
        styleUrl: './camp-form.component.scss',
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        camp_service_1.CampService,
        router_1.ActivatedRoute,
        router_1.Router])
], CampFormComponent);
//# sourceMappingURL=camp-form.component.js.map
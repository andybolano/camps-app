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
exports.CampsComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const router_1 = require("@angular/router");
const camp_service_1 = require("../../services/camp.service");
let CampsComponent = class CampsComponent {
    constructor(campService) {
        this.campService = campService;
        this.camps = [];
        this.isLoading = false;
        this.errorMessage = '';
    }
    ngOnInit() {
        this.loadCamps();
    }
    loadCamps() {
        this.isLoading = true;
        this.errorMessage = '';
        this.campService.getCamps().subscribe({
            next: (camps) => {
                this.camps = camps;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Error al cargar los campamentos: ' + error.message;
                this.isLoading = false;
            },
        });
    }
    onDeleteCamp(id) {
        if (!confirm('¿Está seguro de que desea eliminar este campamento?')) {
            return;
        }
        this.isLoading = true;
        this.campService.deleteCamp(id).subscribe({
            next: () => {
                this.camps = this.camps.filter((camp) => camp.id !== id);
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Error al eliminar el campamento: ' + error.message;
                this.isLoading = false;
            },
        });
    }
};
exports.CampsComponent = CampsComponent;
exports.CampsComponent = CampsComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-camps',
        standalone: true,
        imports: [common_1.CommonModule, router_1.RouterLink, common_1.DatePipe],
        templateUrl: './camps.component.html',
        styleUrl: './camps.component.scss',
    }),
    __metadata("design:paramtypes", [camp_service_1.CampService])
], CampsComponent);
//# sourceMappingURL=camps.component.js.map
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
exports.ClubsComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const router_1 = require("@angular/router");
const router_2 = require("@angular/router");
const club_service_1 = require("../../services/club.service");
const camp_service_1 = require("../../services/camp.service");
let ClubsComponent = class ClubsComponent {
    constructor(clubService, campService, route) {
        this.clubService = clubService;
        this.campService = campService;
        this.route = route;
        this.clubs = [];
        this.campName = 'Cargando...';
        this.isLoading = false;
        this.errorMessage = '';
    }
    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            const campId = params.get('campId');
            if (campId) {
                this.campId = +campId;
                this.loadCampData(this.campId);
                this.loadClubs(this.campId);
            }
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
    loadClubs(campId) {
        this.isLoading = true;
        this.errorMessage = '';
        this.clubService.getClubsByCamp(campId).subscribe({
            next: (clubs) => {
                this.clubs = clubs;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Error al cargar los clubes: ' + error.message;
                this.isLoading = false;
            },
        });
    }
    onDeleteClub(id) {
        if (!confirm('¿Está seguro de que desea eliminar este club?')) {
            return;
        }
        this.isLoading = true;
        this.clubService.deleteClub(id).subscribe({
            next: () => {
                this.clubs = this.clubs.filter((club) => club.id !== id);
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Error al eliminar el club: ' + error.message;
                this.isLoading = false;
            },
        });
    }
};
exports.ClubsComponent = ClubsComponent;
exports.ClubsComponent = ClubsComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-clubs',
        standalone: true,
        imports: [common_1.CommonModule, router_1.RouterLink, common_1.CurrencyPipe],
        templateUrl: './clubs.component.html',
        styleUrl: './clubs.component.scss',
    }),
    __metadata("design:paramtypes", [club_service_1.ClubService,
        camp_service_1.CampService,
        router_2.ActivatedRoute])
], ClubsComponent);
//# sourceMappingURL=clubs.component.js.map
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
exports.CampRankingComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const router_1 = require("@angular/router");
const result_service_1 = require("../../services/result.service");
const camp_service_1 = require("../../services/camp.service");
let CampRankingComponent = class CampRankingComponent {
    constructor(resultService, campService, route, router) {
        this.resultService = resultService;
        this.campService = campService;
        this.route = route;
        this.router = router;
        this.camp = null;
        this.isLoading = false;
        this.errorMessage = '';
        this.rankingData = [];
    }
    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.campId = +params['campId'];
            this.loadCampData();
            this.loadRankingData();
        });
    }
    loadCampData() {
        this.isLoading = true;
        this.campService.getCamp(this.campId).subscribe({
            next: (camp) => {
                this.camp = camp;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = `Error al cargar los datos del campamento: ${error.message}`;
                this.isLoading = false;
            },
        });
    }
    loadRankingData() {
        this.isLoading = true;
        this.errorMessage = '';
        this.resultService.getClubRankingByCamp(this.campId).subscribe({
            next: (data) => {
                this.rankingData = data;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = `Error al cargar el ranking: ${error.message}`;
                this.isLoading = false;
            },
        });
    }
    getMedalClass(rank) {
        if (rank === 1)
            return 'medal-gold';
        if (rank === 2)
            return 'medal-silver';
        if (rank === 3)
            return 'medal-bronze';
        return '';
    }
    getRankBadgeClass(rank) {
        return {
            'bg-success': rank === 1,
            'bg-primary': rank === 2,
            'bg-info': rank === 3,
            'bg-secondary': rank > 3,
        };
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
    goBack() {
        this.router.navigate(['/camps', this.campId]);
    }
};
exports.CampRankingComponent = CampRankingComponent;
exports.CampRankingComponent = CampRankingComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-camp-ranking',
        standalone: true,
        imports: [common_1.CommonModule, router_1.RouterLink],
        templateUrl: './camp-ranking.component.html',
        styleUrl: './camp-ranking.component.scss',
    }),
    __metadata("design:paramtypes", [result_service_1.ResultService,
        camp_service_1.CampService,
        router_1.ActivatedRoute,
        router_1.Router])
], CampRankingComponent);
//# sourceMappingURL=camp-ranking.component.js.map
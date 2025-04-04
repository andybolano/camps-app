import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultService } from '../../services/result.service';
import { CampService, Camp } from '../../services/camp.service';
export declare class CampRankingComponent implements OnInit {
    private resultService;
    private campService;
    private route;
    private router;
    campId: number;
    camp: Camp | null;
    isLoading: boolean;
    errorMessage: string;
    rankingData: any[];
    constructor(resultService: ResultService, campService: CampService, route: ActivatedRoute, router: Router);
    ngOnInit(): void;
    loadCampData(): void;
    loadRankingData(): void;
    getMedalClass(rank: number): string;
    getRankBadgeClass(rank: number): any;
    getRankSuffix(rank: number): string;
    goBack(): void;
}

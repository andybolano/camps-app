import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Club, ClubService } from '../../services/club.service';
import { CampService } from '../../services/camp.service';
export declare class ClubsComponent implements OnInit {
    private clubService;
    private campService;
    private route;
    clubs: Club[];
    campId: number;
    campName: string;
    isLoading: boolean;
    errorMessage: string;
    constructor(clubService: ClubService, campService: CampService, route: ActivatedRoute);
    ngOnInit(): void;
    loadCampData(campId: number): void;
    loadClubs(campId: number): void;
    onDeleteClub(id: number): void;
}

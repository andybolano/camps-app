import { OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Club, ClubService } from '../../services/club.service';
import { Result, ResultService } from '../../services/result.service';
import { CampService } from '../../services/camp.service';
import { EventService } from '../../services/event.service';
export declare class ClubDetailComponent implements OnInit {
    private clubService;
    private resultService;
    private campService;
    private eventService;
    private route;
    resultModal: ElementRef;
    clubId: number;
    campId: number;
    club: Club | null;
    results: Result[];
    isLoading: boolean;
    errorMessage: string;
    currentResult: Result | null;
    resultDetail: {
        eventName: string;
        eventDate?: string;
        totalScore: number;
        rank?: number;
        items: {
            name: string;
            percentage: number;
            score: number;
            weightedScore: number;
        }[];
    } | null;
    modal: any;
    constructor(clubService: ClubService, resultService: ResultService, campService: CampService, eventService: EventService, route: ActivatedRoute);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    loadClubData(): void;
    loadClubResults(): void;
    showResultDetail(result: Result): void;
    private processItems;
    private openModal;
    formatDate(dateString: string | undefined): string;
}

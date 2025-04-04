import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventService, Event } from '../../services/event.service';
import { ResultService, Result } from '../../services/result.service';
import { ClubService, Club } from '../../services/club.service';
export declare class EventScoringComponent implements OnInit {
    private fb;
    private eventService;
    private clubService;
    private resultService;
    private route;
    private router;
    scoringForm: FormGroup;
    event: Event | null;
    clubs: Club[];
    campId: number;
    eventId: number;
    selectedClubId: number | null;
    existingResult: Result | null;
    isLoading: boolean;
    errorMessage: string;
    successMessage: string;
    totalScore: number;
    eventResults: Result[];
    currentRank: number;
    constructor(fb: FormBuilder, eventService: EventService, clubService: ClubService, resultService: ResultService, route: ActivatedRoute, router: Router);
    ngOnInit(): void;
    private initForm;
    private loadEvent;
    private loadClubs;
    private buildScoresForm;
    private loadEventResults;
    private updateCurrentRank;
    private checkExistingResult;
    private populateFormWithExistingResult;
    private resetScores;
    onSubmit(): void;
    goBack(): void;
    reloadExistingScores(): void;
    calculateTotalScore(): void;
    getRankSuffix(rank: number): string;
    getClubName(clubId: number | null): string;
    getRankBadgeClass(rank: number | undefined): any;
}

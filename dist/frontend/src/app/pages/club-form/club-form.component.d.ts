import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubService } from '../../services/club.service';
import { CampService } from '../../services/camp.service';
export declare class ClubFormComponent implements OnInit {
    private fb;
    private clubService;
    private campService;
    private route;
    private router;
    clubForm: FormGroup;
    isEditMode: boolean;
    clubId?: number;
    campId: number;
    campName: string;
    isLoading: boolean;
    errorMessage: string;
    constructor(fb: FormBuilder, clubService: ClubService, campService: CampService, route: ActivatedRoute, router: Router);
    ngOnInit(): void;
    initForm(): void;
    loadCampData(campId: number): void;
    loadClubData(id: number): void;
    onSubmit(): void;
    get name(): import("@angular/forms").AbstractControl<any, any>;
    get city(): import("@angular/forms").AbstractControl<any, any>;
    get participantsCount(): import("@angular/forms").AbstractControl<any, any>;
    get guestsCount(): import("@angular/forms").AbstractControl<any, any>;
    get economsCount(): import("@angular/forms").AbstractControl<any, any>;
    get registrationFee(): import("@angular/forms").AbstractControl<any, any>;
    get isPaid(): import("@angular/forms").AbstractControl<any, any>;
}

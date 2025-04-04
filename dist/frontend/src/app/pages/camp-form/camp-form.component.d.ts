import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CampService } from '../../services/camp.service';
export declare class CampFormComponent implements OnInit {
    private fb;
    private campService;
    private route;
    private router;
    campForm: FormGroup;
    isEditMode: boolean;
    campId?: number;
    isLoading: boolean;
    errorMessage: string;
    constructor(fb: FormBuilder, campService: CampService, route: ActivatedRoute, router: Router);
    ngOnInit(): void;
    initForm(): void;
    loadCampData(id: number): void;
    onSubmit(): void;
    get name(): import("@angular/forms").AbstractControl<any, any>;
    get location(): import("@angular/forms").AbstractControl<any, any>;
    get startDate(): import("@angular/forms").AbstractControl<any, any>;
    get endDate(): import("@angular/forms").AbstractControl<any, any>;
    get description(): import("@angular/forms").AbstractControl<any, any>;
}

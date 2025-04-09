import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { CampService } from '../../services/camp.service';
export declare class EventFormComponent implements OnInit {
    private fb;
    private eventService;
    private campService;
    private route;
    private router;
    eventForm: FormGroup;
    campId: number;
    eventId?: number;
    isEdit: boolean;
    isLoading: boolean;
    errorMessage: string;
    campName: string;
    eventTypes: {
        value: string;
        label: string;
    }[];
    characteristicOptions: {
        value: string;
        label: string;
    }[];
    constructor(fb: FormBuilder, eventService: EventService, campService: CampService, route: ActivatedRoute, router: Router);
    ngOnInit(): void;
    private initForm;
    private loadCampData;
    private loadEventData;
    get items(): FormArray;
    get memberBasedItems(): FormArray;
    get eventType(): string;
    addItem(name?: string, percentage?: number): void;
    addMemberBasedItem(name?: string, percentage?: number, applicableCharacteristics?: string[]): void;
    removeItem(index: number): void;
    removeMemberBasedItem(index: number): void;
    clearItems(): void;
    clearMemberBasedItems(): void;
    onSubmit(): void;
    cancel(): void;
    addCharacteristic(index: number, value: string): void;
    removeCharacteristic(index: number, value: string): void;
    isCharacteristicSelected(index: number, value: string): boolean;
    onCharacteristicChange(event: Event, index: number, value: string): void;
    private getMultiBranchItemAt;
}

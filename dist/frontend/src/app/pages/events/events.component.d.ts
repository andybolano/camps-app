import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, EventService } from '../../services/event.service';
export declare class EventsComponent implements OnInit {
    private eventService;
    private route;
    private router;
    events: Event[];
    campId: number;
    campName: string;
    isLoading: boolean;
    errorMessage: string;
    constructor(eventService: EventService, route: ActivatedRoute, router: Router);
    ngOnInit(): void;
    loadEvents(): void;
    onDeleteEvent(id: number): void;
    goBack(): void;
    getTotalPercentage(event: any): number;
}

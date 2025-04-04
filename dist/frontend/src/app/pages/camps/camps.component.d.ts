import { OnInit } from '@angular/core';
import { Camp, CampService } from '../../services/camp.service';
export declare class CampsComponent implements OnInit {
    private campService;
    camps: Camp[];
    isLoading: boolean;
    errorMessage: string;
    constructor(campService: CampService);
    ngOnInit(): void;
    loadCamps(): void;
    onDeleteCamp(id: number): void;
}

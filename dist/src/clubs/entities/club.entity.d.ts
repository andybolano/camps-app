import { Camp } from '../../camps/entities/camp.entity';
import { Result } from '../../results/entities/result.entity';
export declare class Club {
    id: number;
    name: string;
    city: string;
    participantsCount: number;
    guestsCount: number;
    minorsCount: number;
    economsCount: number;
    registrationFee: number;
    isPaid: boolean;
    shieldUrl: string;
    camp: Camp;
    results: Result[];
}

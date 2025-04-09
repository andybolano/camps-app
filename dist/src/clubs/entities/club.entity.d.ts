import { Camp } from '../../camps/entities/camp.entity';
import { Result } from '../../results/entities/result.entity';
import { MemberCharacteristic } from './member-characteristic.entity';
export declare class Club {
    id: number;
    name: string;
    city: string;
    participantsCount: number;
    guestsCount: number;
    minorsCount: number;
    economsCount: number;
    companionsCount: number;
    registrationFee: number;
    isPaid: boolean;
    shieldUrl: string;
    camp: Camp;
    results: Result[];
    memberCharacteristics: MemberCharacteristic[];
}

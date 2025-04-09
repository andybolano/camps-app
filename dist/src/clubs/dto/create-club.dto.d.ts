import { CreateMemberCharacteristicDto } from './create-member-characteristic.dto';
export declare class CreateClubDto {
    name: string;
    city: string;
    participantsCount: number;
    guestsCount: number;
    minorsCount: number;
    economsCount: number;
    companionsCount: number;
    registrationFee: number;
    isPaid?: boolean;
    shieldUrl?: string;
    campId: number;
    memberCharacteristics?: CreateMemberCharacteristicDto[];
}

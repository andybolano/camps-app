import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Camp } from '../../camps/entities/camp.entity';
import { Result } from '../../results/entities/result.entity';

@Entity()
export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  participantsCount: number;

  @Column()
  guestsCount: number;

  @Column()
  economsCount: number;

  @Column({ type: 'float' })
  registrationFee: number;

  @Column({ type: 'boolean', default: true })
  isPaid: boolean;

  @ManyToOne(() => Camp, (camp) => camp.clubs)
  camp: Camp;

  @OneToMany(() => Result, (result) => result.club)
  results: Result[];
}

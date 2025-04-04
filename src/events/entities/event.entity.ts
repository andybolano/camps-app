import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Camp } from '../../camps/entities/camp.entity';
import { EventItem } from './event-item.entity';
import { Result } from '../../results/entities/result.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Camp, (camp) => camp.events)
  camp: Camp;

  @OneToMany(() => EventItem, (item) => item.event, { cascade: true })
  items: EventItem[];

  @OneToMany(() => Result, (result) => result.event)
  results: Result[];
}

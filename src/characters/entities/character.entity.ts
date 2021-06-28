import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Episode } from '../../episodes/entities/episode.entity';

@Entity({ name: 'characters' })
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  race: string;

  @ManyToMany((type) => Episode, (episode) => episode.name)
  @JoinTable()
  episodes: Episode[];
}

import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Episode } from '../../episodes/entities/episode.entity';
import { JoinColumn } from 'typeorm';

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

  @OneToOne((type) => Episode, (episode) => episode.name)
  @ApiProperty({ default: [] })
  @JoinColumn({ name: 'episodeName' })
  episodes: Episode;
}

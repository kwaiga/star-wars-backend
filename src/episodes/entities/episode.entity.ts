import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Character } from '../../characters/entities/character.entity';

@Entity({ name: 'episodes' })
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ManyToMany((type) => Character, (character) => character.name)
  characters: Character[];
}

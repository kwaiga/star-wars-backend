import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'characters' })
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  race: string;
}

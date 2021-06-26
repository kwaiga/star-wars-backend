import { Injectable } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Repository } from 'typeorm';
import { Character } from './entities/character.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto) {
    const newCharacter = new Character();
    Object.assign(newCharacter, createCharacterDto);
    return await this.characterRepository.save(newCharacter);
  }

  async findAll(): Promise<Character[]> {
    return await this.characterRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} character`;
  }

  update(id: number, updateCharacterDto: UpdateCharacterDto) {
    return `This action updates a #${id} character`;
  }

  remove(id: number) {
    return `This action removes a #${id} character`;
  }

  async removeAll() {
    return await this.characterRepository.clear();
  }
}

import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Repository } from 'typeorm';
import { Character } from './entities/character.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from '../episodes/entities/episode.entity';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const characterByName = await this.characterRepository.findOne({
      name: createCharacterDto.name,
    });
    if (characterByName) {
      throw new HttpException(
        'This character already exist, try with another one',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newCharacter = new Character();
    Object.assign(newCharacter, createCharacterDto);

    return await this.characterRepository.save(newCharacter);
  }

  async findAll(): Promise<Character[]> {
    return await this.characterRepository.find({ relations: ['episodes'] });
  }

  async findOne(id: number): Promise<Character> {
    const character = await this.characterRepository.findOne(id);
    if (!character) {
      throw new HttpException(
        'Character ID does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return character;
  }

  async update(
    id: number,
    updateCharacterDto: UpdateCharacterDto,
  ): Promise<Character> {
    const character = await this.findOne(id);
    Object.assign(character, updateCharacterDto);
    return await this.characterRepository.save(character);
  }

  async remove(id: number): Promise<Character> {
    const character = await this.findOne(id);
    return await this.characterRepository.remove(character);
  }

  async removeAll(): Promise<void> {
    return await this.characterRepository.clear();
  }

  async updateCharacterWIthEpisode(
    characterID: number,
    episodeID: number,
  ): Promise<Character> {
    const characterToUpdate: Character = await this.findOne(characterID);
    const episode: Episode = await this.episodeRepository.findOne(episodeID);
    characterToUpdate.episodes = episode;
    return await this.characterRepository.save(characterToUpdate);
  }
}

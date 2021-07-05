import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Repository } from 'typeorm';
import { Character } from './entities/character.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from '../episodes/entities/episode.entity';
import { EpisodesService } from '../episodes/episodes.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    private readonly episodesService: EpisodesService,
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

  async findWithEpisodes(): Promise<Character[]> {
    return await this.characterRepository.find({
      relations: ['episodes'],
    });
  }

  async findAll(): Promise<Character[]> {
    return await this.characterRepository.find();
  }

  async findOneById(id: number): Promise<Character> {
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
    const character = await this.findOneById(id);
    Object.assign(character, updateCharacterDto);
    return await this.characterRepository.save(character);
  }

  async remove(id: number): Promise<Character> {
    const character = await this.findOneById(id);
    return await this.characterRepository.remove(character);
  }

  async removeAll(): Promise<void> {
    return await this.characterRepository.clear();
  }

  async findOneWithEpisodes(id: number): Promise<Character> {
    const character = await this.characterRepository.findOne(id, {
      relations: ['episodes'],
    });
    if (!character) {
      throw new HttpException(
        'Character ID does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return character;
  }

  async addEpisodeToCharacter(
    characterId: number,
    episodeId: number,
  ): Promise<Character> {
    const characterToUpdate: Character = await this.findOneById(characterId);
    const episode: Episode = await this.episodesService.findOneById(episodeId);
    const existingCharactersRelations = await this.findOneWithEpisodes(
      characterId,
    );
    const arrayOfExistingEpisodes = existingCharactersRelations.episodes;
    const contains = arrayOfExistingEpisodes.some((e) => e.id === episodeId);
    if (contains) {
      throw new HttpException(
        'Those episodes are already assign to characters',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      const arrayOfEpisodes: Episode[] = [];
      arrayOfEpisodes.push(...arrayOfExistingEpisodes, episode);
      characterToUpdate.episodes = arrayOfEpisodes;
      return await this.characterRepository.save(characterToUpdate);
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Character>> {
    return paginate<Character>(this.characterRepository, options);
  }
}

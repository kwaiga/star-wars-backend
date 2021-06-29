import { Test, TestingModule } from '@nestjs/testing';
import { CharactersService } from './characters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './entities/character.entity';
import ormconfig from '../ormconfig';
import { CreateCharacterDto } from './dto/create-character.dto';
import { Episode } from '../episodes/entities/episode.entity';

describe('CharactersService', () => {
  let service: CharactersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Character]),
        TypeOrmModule.forFeature([Episode]),
        TypeOrmModule.forRoot(ormconfig),
      ],
      providers: [CharactersService],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
    await service.removeAll();
  });

  afterEach(async () => {
    // await service.removeAll();
  });

  it('Should find created character', async () => {
    const createCharacterDto: CreateCharacterDto = {
      name: 'Han Solo',
      race: 'human',
    };
    await service.create(createCharacterDto);
    const resultArr: Character[] = await service.findAll();
    expect(resultArr.length).toEqual(1);
    expect(resultArr[0].id).toBeDefined();
    expect(resultArr[0].name).toEqual('Han Solo');
    expect(resultArr[0].race).toEqual('human');
  });

  it('Fill out db', async () => {
    const createCharacterDto: CreateCharacterDto = {
      name: 'Chewbacca',
      race: 'wookie',
    };
    await service.create(createCharacterDto);

    const yoda: CreateCharacterDto = {
      name: 'yoda',
      race: 'tridactyl',
    };
    await service.create(yoda);

    const hanSolo: CreateCharacterDto = {
      name: 'Han Solo',
      race: 'human',
    };
    await service.create(hanSolo);

    const stormtrooper: CreateCharacterDto = {
      name: 'Stormtrooper',
      race: 'human',
    };
    await service.create(stormtrooper);
  });
});

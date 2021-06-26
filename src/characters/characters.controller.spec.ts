import { Test, TestingModule } from '@nestjs/testing';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { Repository } from 'typeorm';
import { Character } from './entities/character.entity';

describe('CharactersController', () => {
  let controller: CharactersController;

  const mockCharactersService = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),

    update: jest.fn((id, dto) => ({
      id,
      ...dto,
    })),

    remove: jest.fn((id) => ({})),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [CharactersService],
    })
      .overrideProvider(CharactersService)
      .useValue(mockCharactersService)
      .compile();

    controller = module.get<CharactersController>(CharactersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a character', () => {
    expect(
      controller.create({
        name: 'Stormtrooper',
        race: 'human',
      }),
    ).toEqual({
      id: expect.any(Number),
      name: 'Stormtrooper',
      race: 'human',
    });

    expect(mockCharactersService.create).toHaveBeenCalled();
  });

  it('should return an array of all characters', async () => {
    const characterRepository = new Repository<Character>();

    const charactersService = new CharactersService(characterRepository);
    const charactersController = new CharactersController(charactersService);

    const result = Promise['test'];
    jest.spyOn(charactersService, 'findAll').mockImplementation(() => result);

    expect(await charactersController.findAll()).toBe(result);
  });

  it('should update character', () => {
    const dto = { name: 'Stormtrooper2', race: 'human' };
    expect(controller.update(1, dto)).toBeDefined();
    expect(controller.update(1, dto)).toEqual({
      id: 1,
      ...dto,
    });
  });

  it('should delete character', () => {
    expect(controller.remove(1)).toEqual({});
  });
});

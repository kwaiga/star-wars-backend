import { getRepositoryToken } from '@nestjs/typeorm';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';
import { characterStub } from '../../../test/stubs/character.stub';
import { Character } from '../entities/character.entity';

export const CharactersRepositoryMock = {
  provide: getRepositoryToken(Character),
  options: {} as EntitySchemaOptions<any>,
  useFactory: () => ({
    findOne: jest.fn(() => characterStub()),
    save: jest.fn(() => characterStub()),
    find: jest.fn(() => [characterStub()]),
    remove: jest.fn(() => characterStub()),
  }),
};

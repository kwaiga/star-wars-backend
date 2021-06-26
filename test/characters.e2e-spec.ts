import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CharactersModule } from '../src/characters/characters.module';
import { CharactersService } from '../src/characters/characters.service';

describe('Characters', () => {
  let app: INestApplication;
  const charactersService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CharactersModule],
    })
      .overrideProvider(CharactersService)
      .useValue(charactersService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET characters`, () => {
    return request(app.getHttpServer()).get('/characters').expect(200).expect({
      data: charactersService.findAll(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

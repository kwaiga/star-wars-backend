import { expect } from 'chai';
import 'chai-http';
import * as chai from 'chai';
import { CreateEpisodeDto } from '../src/episodes/dto/create-episode.dto';
import { EpisodesService } from '../src/episodes/episodes.service';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from '../src/episodes/entities/episode.entity';
import { AppController } from '../src/app.controller';
import { AppModule } from '../src/app.module';
import { AppService } from '../src/app.service';
import { CharactersService } from '../src/characters/characters.service';
import { Character } from '../src/characters/entities/character.entity';
import { CreateCharacterDto } from '../src/characters/dto/create-character.dto';

chai.use(require('chai-http'));

describe('Test full flow of adding episodes to characters', () => {
  let episodesService: EpisodesService;
  let charactersService: CharactersService;
  const LOCAL_DEV_URL = 'http://localhost:3000';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Episode, Character]), AppModule],
      controllers: [AppController],
      providers: [AppService, EpisodesService, CharactersService],
    }).compile();

    episodesService = module.get<EpisodesService>(EpisodesService);
    charactersService = module.get<CharactersService>(CharactersService);

    const episodeDto1: CreateEpisodeDto = {
      name: 'YODA THE FINAL REVENGE',
      productionYear: 2000,
    };

    const episodeDto2: CreateEpisodeDto = {
      name: 'CHEWBACCA AWAKENS',
      productionYear: 2090,
    };

    const characterDto: CreateCharacterDto = {
      name: 'Baby Yoda',
      race: 'Unknown humanoid',
    };

    await episodesService.removeAll();
    await charactersService.removeAll();
    await episodesService.create(episodeDto1);
    await episodesService.create(episodeDto2);
    await charactersService.create(characterDto);
  });

  describe('Episodes', () => {
    it('should get all episodes', (done) => {
      chai
        .request(`${LOCAL_DEV_URL}/episodes`)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.length(2);
          expect(res.body[0].name).to.be.equal('YODA THE FINAL REVENGE');
          expect(res.body[1].name).to.be.equal('CHEWBACCA AWAKENS');
          expect(res.body[0].id).to.exist;
          expect(res.body[1].id).to.exist;
          done();
        });
    });

    it('should successfully post episode', (done) => {
      const newEpisode: CreateEpisodeDto = {
        name: 'Han Solo fights solo',
        productionYear: 2056,
      };
      chai
        .request(`${LOCAL_DEV_URL}/episodes`)
        .post('/')
        .send(newEpisode)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body.name).to.be.equal('HAN SOLO FIGHTS SOLO');
          expect(res.body.productionYear).to.be.equal(2056);
          expect(res.body.id).to.exist;
          done();
        });
    });
  });

  describe('Characters', () => {
    it('should get all characters', (done) => {
      chai
        .request(`${LOCAL_DEV_URL}/characters`)
        .get('/details')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.length(1);
          expect(res.body[0].name).to.be.equal('Baby Yoda');
          expect(res.body[0].race).to.be.equal('Unknown humanoid');
          expect(res.body[0].episodes).to.be.empty;
          done();
        });
    });
    it('should successfully post character', (done) => {
      const newCharacter: CreateCharacterDto = {
        name: 'Sheev Palpatine',
        race: 'human',
      };
      chai
        .request(`${LOCAL_DEV_URL}/characters`)
        .post('/')
        .send(newCharacter)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body.name).to.be.equal('Sheev Palpatine');
          expect(res.body.race).to.be.equal('human');
          expect(res.body.id).to.exist;
          done();
        });
    });
  });

  describe('Add Episode to character', () => {
    let epId;
    let charId;
    it('Should succesfully add  episode to character', (done) => {
      //Check episode ID
      chai
        .request(`${LOCAL_DEV_URL}/episodes`)
        .get('/')
        .end((err, res) => {
          epId = res.body[0].id;
          //Check character ID
          chai
            .request(`${LOCAL_DEV_URL}/characters`)
            .get('/')
            .end((err, res) => {
              charId = res.body.items[0].id;
              //Check if proper episode have proper character
              chai
                .request(`${LOCAL_DEV_URL}/characters`)
                .post(`/${charId}/episodes/${epId}`)
                .end((err, res) => {
                  expect(res).to.have.status(201);
                  expect(res.body.name).to.be.equal('Baby Yoda');
                  expect(res.body.episodes[0].name).to.be.equal(
                    'YODA THE FINAL REVENGE',
                  );
                  done();
                });
              done();
            });
          done();
        });
    });
  });
});

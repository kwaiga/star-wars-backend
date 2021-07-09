import { EpisodesService } from '../../episodes/episodes.service';
import { episodeStub } from '../../../test/stubs/episode.stub';
import { baseEpisodeStub } from '../../../test/stubs/base-episode.stub';

export const EpisodesServiceMock = {
  provide: EpisodesService,
  useFactory: () => ({
    create: jest.fn(() => episodeStub()),
    findAll: jest.fn(() => [baseEpisodeStub()]),
    findOneById: jest.fn(() => episodeStub()),
    update: jest.fn(() => episodeStub()),
    remove: jest.fn(() => episodeStub()),
  }),
};

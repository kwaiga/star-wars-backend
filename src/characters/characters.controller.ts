// eslint-disable-next-line
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, DefaultValuePipe, } from '@nestjs/common';
// eslint-disable-next-line
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags, ApiUnprocessableEntityResponse, } from '@nestjs/swagger';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { BasicCharacter, Character } from './entities/character.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { BasicEpisode, Episode } from '../episodes/entities/episode.entity';

@ApiTags('STAR WARS CHARACTERS')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Created!' })
  @ApiBadRequestResponse()
  @ApiUnprocessableEntityResponse()
  create(@Body() createCharacterDto: CreateCharacterDto): Promise<Character> {
    return this.charactersService.create(createCharacterDto);
  }

  @Get()
  @ApiOkResponse({ type: [BasicCharacter] })
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<BasicCharacter>> {
    limit = limit > 10 ? 10 : limit;
    return this.charactersService.paginate({
      page,
      limit,
    });
  }

  @Get('details')
  @ApiOkResponse({ type: [Character] })
  @Get()
  findWithEpisodes(): Promise<Character[]> {
    return this.charactersService.findWithEpisodes();
  }

  @Get(':id')
  @ApiOkResponse({ type: Character })
  @ApiBadRequestResponse()
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Character> {
    return this.charactersService.findOneById(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 204, description: 'Resource updated successfully' })
  @ApiBadRequestResponse()
  update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ): Promise<Character> {
    return this.charactersService.update(+id, updateCharacterDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Resource deleted successfully' })
  @ApiBadRequestResponse()
  remove(@Param('id', ParseIntPipe) id: number): Promise<Character> {
    return this.charactersService.remove(+id);
  }

  @Get(':characterId/episodes')
  @ApiResponse({ type: [BasicEpisode] })
  @ApiBadRequestResponse()
  findOneWithEpisodes(
    @Param('characterId', ParseIntPipe) characterId: number,
  ): Promise<BasicEpisode[]> {
    return this.charactersService.findOneWithEpisodes(+characterId);
  }

  @Get(':characterId/episodes/:episodeId')
  @ApiResponse({ type: Episode })
  @ApiBadRequestResponse()
  findOneWithEpisode(
    @Param('characterId', ParseIntPipe) characterId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
  ): Promise<Episode> {
    return this.charactersService.findOneWithEpisode(characterId, episodeId);
  }

  @Post(':characterId/episodes/:episodeId')
  @ApiCreatedResponse({ description: 'Added!' })
  @ApiBadRequestResponse()
  @ApiUnprocessableEntityResponse()
  addEpisodeToCharacter(
    @Param('characterId', ParseIntPipe) characterId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
  ): Promise<Character> {
    return this.charactersService.addEpisodeToCharacter(characterId, episodeId);
  }
}

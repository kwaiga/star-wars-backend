import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Character } from './entities/character.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('STAR WARS CHARACTERS')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiUnprocessableEntityResponse()
  create(@Body() createCharacterDto: CreateCharacterDto) {
    return this.charactersService.create(createCharacterDto);
  }

  @Get()
  @ApiOkResponse()
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Character>> {
    limit = limit > 10 ? 10 : limit;
    return this.charactersService.paginate({
      page,
      limit,
    });
  }

  @Get('episodes')
  @ApiOkResponse({ type: [Character] })
  @Get()
  findWithEpisodes() {
    return this.charactersService.findWithEpisodes();
  }

  @Get(':id')
  @ApiBadRequestResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.findOneById(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 204, description: 'resource updated successfully' })
  @ApiBadRequestResponse()
  @UsePipes()
  update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ) {
    return this.charactersService.update(+id, updateCharacterDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'resource deleted successfully' })
  @ApiBadRequestResponse()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.remove(+id);
  }

  @Get(':characterId/episodes')
  @ApiResponse({ type: Character })
  @ApiBadRequestResponse()
  findOneWithEpisodes(@Param('characterId', ParseIntPipe) characterId: number) {
    return this.charactersService.findOneWithEpisodes(+characterId);
  }
  @Post(':characterId/episodes/:episodeId')
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiUnprocessableEntityResponse()
  addEpisodeToCharacter(
    @Param('characterId', ParseIntPipe) characterId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
  ) {
    return this.charactersService.addEpisodeToCharacter(characterId, episodeId);
  }
}

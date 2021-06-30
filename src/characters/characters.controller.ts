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
  ValidationPipe,
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
  @ApiOkResponse({ type: [Character] })
  @Get()
  findAll() {
    return this.charactersService.findAll();
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
    return this.charactersService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 204, description: 'resource updated successfully' })
  @ApiBadRequestResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
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
  @ApiResponse({ status: 204, description: 'resource updated successfully' })
  @ApiBadRequestResponse()
  updateWitchEpisode(@Param('characterId', ParseIntPipe) characterId: number) {
    return this.charactersService.findOneWithEpisode(+characterId);
  }


}

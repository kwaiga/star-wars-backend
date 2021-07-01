import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { ApiBadRequestResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('STAR WARS EPISODES')
@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Post()
  create(@Body() createEpisodeDto: CreateEpisodeDto) {
    return this.episodesService.create(createEpisodeDto);
  }

  @Get()
  findAll() {
    return this.episodesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.episodesService.findOneById(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 204, description: 'Episode updated successfully' })
  @ApiBadRequestResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEpisodeDto: UpdateEpisodeDto,
  ) {
    return this.episodesService.update(+id, updateEpisodeDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Episode deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.episodesService.remove(+id);
  }
}

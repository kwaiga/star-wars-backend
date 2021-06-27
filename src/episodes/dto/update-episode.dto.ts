import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEpisodeDto } from './create-episode.dto';
import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateEpisodeDto extends PartialType(CreateEpisodeDto) {
  @ApiProperty()
  @IsAlphanumeric()
  @MinLength(1)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;
}

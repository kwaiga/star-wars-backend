import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEpisodeDto {
  @ApiProperty()
  @IsAlphanumeric()
  @MinLength(1)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;
}

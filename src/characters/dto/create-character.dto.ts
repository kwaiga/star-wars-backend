import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, MaxLength, MinLength } from 'class-validator';

export class CreateCharacterDto {
  @ApiProperty()
  @IsAlphanumeric()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsAlphanumeric()
  @MinLength(1)
  @MaxLength(50)
  @ApiProperty({ required: false })
  race?: string;
}

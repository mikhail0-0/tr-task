import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateColumnDTO {
  @ApiProperty({ example: 'testColumn' })
  @IsString()
  @Length(0, 100)
  name: string;
}

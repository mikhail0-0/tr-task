import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCommentDTO {
  @ApiProperty({ example: 'testComment' })
  @IsString()
  @Length(0, 1000)
  text: string;
}

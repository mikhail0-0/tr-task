import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCardDTO {
  @ApiProperty({ example: 'testCard' })
  @IsString()
  @Length(0, 100)
  name: string;
}

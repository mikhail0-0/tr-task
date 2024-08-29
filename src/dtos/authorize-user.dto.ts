import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class AuthorizeUserDTO {
  @ApiProperty({ example: 'test@mail.com' })
  @IsEmail()
  @Length(0, 100)
  email: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @Length(0, 100)
  password: string;
}

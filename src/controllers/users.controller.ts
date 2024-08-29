import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../services/users-service';
import { Request, Response } from 'express';
import { AuthData, UserEntity } from '../entities/user.entity';
import { Protected, Public } from '../guards/auth.guard';
import { sendResponse } from 'src/common/set-res-header';
import { AuthorizeUserDTO } from 'src/dtos/authorize-user.dto';
import { CreateUserDTO } from 'src/dtos/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  @Inject()
  private readonly usersService: UsersService;

  @ApiOperation({ summary: 'Authorize user by email and password' })
  @Public()
  @Post('auth')
  async authorize(@Body() dto: AuthorizeUserDTO): Promise<AuthData> {
    return await this.usersService.authorize(dto);
  }

  @ApiOperation({ summary: 'Get user by id' })
  @Get(':userId')
  async user(@Param('userId') userId: string): Promise<UserEntity> {
    return await this.usersService.findById(userId);
  }

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async users(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @Protected()
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string): Promise<UserEntity> {
    return await this.usersService.deleteById(userId);
  }

  @ApiOperation({ summary: 'Create user' })
  @Post()
  async createUser(
    @Body() dto: CreateUserDTO,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const newUser = await this.usersService.save(dto, undefined);
    sendResponse(req, res, newUser.id);
  }

  @ApiOperation({ summary: 'Update user' })
  @Protected()
  @Put(':userId')
  async updateUser(
    @Body() dto: CreateUserDTO,
    @Param('userId') userId: string,
  ) {
    const { password, ...result } = await this.usersService.save(dto, userId);
    return result;
  }
}

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthorizeUserDTO } from 'src/dtos/authorize-user.dto';
import { AuthData, UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { SALT_ROUNDS } from 'src/common/constants';
import { AbstractService } from 'src/common/abstract-service';

@Injectable()
export class UsersService extends AbstractService<UserEntity> {
  @InjectRepository(UserEntity)
  protected readonly repository: Repository<UserEntity>;

  @Inject()
  private readonly jwtService: JwtService;

  async checkParents(params: { userId?: string }): Promise<void> {
    const existUser = await this.findById(params.userId);
  }

  async authorize(dto: AuthorizeUserDTO): Promise<AuthData> {
    const { email, password } = dto;
    const targetUser = await this.repository.findOneBy({ email });
    if (!targetUser) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const verify = await bcrypt.compare(password, targetUser.password);
    if (!verify) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload: Pick<UserEntity, 'id' | 'email'> = {
      id: targetUser.id,
      email: targetUser.email,
    };
    const token = await this.jwtService.signAsync(payload);
    return { ...payload, access_token: token };
  }

  async save(
    dto: AuthorizeUserDTO,
    id: string | undefined,
  ): Promise<UserEntity> {
    const existWithEmail = await this.repository.findOneBy({
      email: dto.email,
    });
    if (existWithEmail && (!id || id !== existWithEmail.id)) {
      throw new HttpException(
        'user with email already exist',
        HttpStatus.CONFLICT,
      );
    }

    const saveUserData: Omit<UserEntity, 'id'> & { id: string | undefined } = {
      ...dto,
      id,
      password: dto.password
        ? bcrypt.hashSync(dto.password, SALT_ROUNDS)
        : undefined,
    };
    return await this.repository.save(saveUserData);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.repository.find();
  }
}

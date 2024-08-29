import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { AbstractService } from 'src/common/abstract-service';
import { AbstractEntity } from 'src/common/abstract.entity';
import { AuthData } from 'src/entities/user.entity';
import { CardsService } from 'src/services/cards-service';
import { ColumnsService } from 'src/services/columns-service';
import { CommentsService } from 'src/services/comments-service';
import { UsersService } from 'src/services/users-service';

dotenv.config();

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_PROTECTED_KEY = 'isProtected';
export const Protected = () => SetMetadata(IS_PROTECTED_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private readonly jwtService: JwtService;

  @Inject()
  private readonly reflector: Reflector;

  @Inject()
  private readonly usersService: UsersService;

  @Inject()
  private readonly columnsService: ColumnsService;

  @Inject()
  private readonly cardsService: CardsService;

  @Inject()
  private readonly commentsService: CommentsService;

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers['authorization'];
    if (!authorization) return undefined;

    const [type, token] = authorization.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    let payload: AuthData | null = null;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET,
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    const isProtected = this.reflector.getAllAndOverride<boolean>(
      IS_PROTECTED_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isProtected) {
      const fieldServices: {
        field: string;
        service: AbstractService<AbstractEntity>;
      }[] = [
        { field: 'commentId', service: this.commentsService },
        { field: 'cardId', service: this.cardsService },
        { field: 'columnId', service: this.columnsService },
        { field: 'userId', service: this.usersService },
      ];
      const params = request.params;

      if (!payload || payload.id !== params.userId) {
        throw new UnauthorizedException();
      }

      for (const { field, service } of fieldServices) {
        if (params[field]) {
          await service.checkParents(params);
          break;
        }
      }
    }

    return true;
  }
}

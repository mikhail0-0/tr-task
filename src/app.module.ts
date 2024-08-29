import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/data-source';
import { UsersService } from './services/users-service';
import { UserEntity } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { ColumnEntity } from './entities/column.entity';
import { CardEntity } from './entities/card.entity';
import { CommentEntity } from './entities/comment.entity';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ColumnsController } from './controllers/columns.controller';
import { ColumnsService } from './services/columns-service';
import { CardsService } from './services/cards-service';
import { CardsController } from './controllers/cards.controller';
import { TOKEN_EXPIRES_IN } from './common/constants';
import { CommentsService } from './services/comments-service';
import { CommentsController } from './controllers/comments.controller';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([
      UserEntity,
      ColumnEntity,
      CardEntity,
      CommentEntity,
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: `${TOKEN_EXPIRES_IN}s` },
    }),
  ],
  controllers: [
    UsersController,
    ColumnsController,
    CardsController,
    CommentsController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    UsersService,
    ColumnsService,
    CardsService,
    CommentsService,
  ],
})
export class AppModule {}

import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { sendResponse } from 'src/common/set-res-header';
import { CreateCommentDTO } from 'src/dtos/create-comment.dto';
import { CommentEntity } from 'src/entities/comment.entity';
import { Protected } from 'src/guards/auth.guard';
import { CommentsService } from 'src/services/comments-service';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('users/:userId/columns/:columnId/cards/:cardId/comments')
export class CommentsController {
  @Inject()
  private readonly commentsService: CommentsService;

  @ApiOperation({ summary: 'Get comment by id' })
  @Get(':commentId')
  async comment(@Param('commentId') id: string): Promise<CommentEntity> {
    return await this.commentsService.findById(id);
  }

  @ApiOperation({ summary: 'Get comments for card by id' })
  @Get()
  async comments(@Param('cardId') cardId: string): Promise<CommentEntity[]> {
    return await this.commentsService.findByCardId(cardId);
  }

  @ApiOperation({ summary: 'Delete comment by id' })
  @Protected()
  @Delete(':commentId')
  async deleteComment(@Param('commentId') id: string): Promise<CommentEntity> {
    return await this.commentsService.deleteById(id);
  }

  @ApiOperation({ summary: 'Create comment for card' })
  @Protected()
  @Post()
  async createComment(
    @Body() dto: CreateCommentDTO,
    @Param('cardId') cardId: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const newColumn = await this.commentsService.save(dto, cardId, undefined);
    sendResponse(req, res, newColumn.id);
  }

  @ApiOperation({ summary: 'Update comment' })
  @Protected()
  @Put(':commentId')
  async updateComment(
    @Body() dto: CreateCommentDTO,
    @Param('cardId') cardId: string,
    @Param('commentId') commentId: string,
  ): Promise<CommentEntity> {
    return await this.commentsService.save(dto, cardId, commentId);
  }
}

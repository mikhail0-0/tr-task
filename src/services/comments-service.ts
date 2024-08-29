import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract-service';
import { CreateCommentDTO } from 'src/dtos/create-comment.dto';
import { CommentEntity } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService extends AbstractService<CommentEntity> {
  @InjectRepository(CommentEntity)
  protected readonly repository: Repository<CommentEntity>;

  async checkParents(params: {
    commentId?: string;
    cardId?: string;
    columnId?: string;
    userId?: string;
  }): Promise<void> {
    const existComment = await this.repository.findOne({
      where: { id: params.commentId },
      relations: ['card', 'card.column', 'card.column.user'],
    });
    if (
      !existComment ||
      existComment.card.id !== params.cardId ||
      existComment.card.column.id !== params.columnId ||
      existComment.card.column.user.id !== params.userId
    ) {
      throw new BadRequestException();
    }
  }

  async save(
    dto: CreateCommentDTO,
    cardId: string,
    id: string | undefined,
  ): Promise<CommentEntity> {
    const saveCommentData: Omit<CommentEntity, 'id'> & {
      id: string | undefined;
    } = {
      ...dto,
      cardId,
      id,
    };
    return await this.repository.save(saveCommentData);
  }

  async findByCardId(cardId: string): Promise<CommentEntity[]> {
    return await this.repository.findBy({ cardId });
  }
}

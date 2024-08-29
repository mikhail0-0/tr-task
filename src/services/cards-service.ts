import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract-service';
import { CreateCardDTO } from 'src/dtos/create-card.dto';
import { CardEntity } from 'src/entities/card.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CardsService extends AbstractService<CardEntity> {
  @InjectRepository(CardEntity)
  protected readonly repository: Repository<CardEntity>;

  async checkParents(params: {
    cardId?: string;
    columnId?: string;
    userId?: string;
  }): Promise<void> {
    const existCard = await this.repository.findOne({
      where: { id: params.cardId },
      relations: ['column', 'column.user'],
    });
    if (
      !existCard ||
      existCard.id !== params.cardId ||
      existCard.column.id !== params.columnId ||
      existCard.column.user.id !== params.userId
    ) {
      throw new BadRequestException();
    }
  }

  async save(
    dto: CreateCardDTO,
    columnId: string,
    id: string | undefined,
  ): Promise<CardEntity> {
    const existWithName = await this.repository.findOneBy({
      name: dto.name,
      columnId,
    });
    if (existWithName && (!id || id !== existWithName.id)) {
      throw new HttpException(
        'card with name already exist',
        HttpStatus.CONFLICT,
      );
    }

    const saveCardData: Omit<CardEntity, 'id'> & { id: string | undefined } = {
      ...dto,
      columnId,
      id,
    };
    return await this.repository.save(saveCardData);
  }

  async findByColumnId(columnId: string): Promise<CardEntity[]> {
    return await this.repository.findBy({ columnId });
  }
}

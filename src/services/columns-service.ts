import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnEntity } from 'src/entities/column.entity';
import { Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract-service';
import { CreateColumnDTO } from 'src/dtos/create-column.dto';

@Injectable()
export class ColumnsService extends AbstractService<ColumnEntity> {
  @InjectRepository(ColumnEntity)
  protected readonly repository: Repository<ColumnEntity>;

  async checkParents(params: {
    columnId?: string;
    userId?: string;
  }): Promise<void> {
    const existColumn = await this.repository.findOne({
      where: { id: params.columnId },
      relations: ['user'],
    });
    if (
      !existColumn ||
      existColumn.id !== params.columnId ||
      existColumn.user.id !== params.userId
    ) {
      throw new BadRequestException();
    }
  }

  async save(
    dto: CreateColumnDTO,
    userId: string,
    id: string | undefined,
  ): Promise<ColumnEntity> {
    const existWithName = await this.repository.findOneBy({
      name: dto.name,
      userId,
    });
    if (existWithName && (!id || id !== existWithName.id)) {
      throw new HttpException(
        'column with name already exist',
        HttpStatus.CONFLICT,
      );
    }

    const saveColumnData: Omit<ColumnEntity, 'id'> & {
      id: string | undefined;
    } = {
      ...dto,
      userId,
      id,
    };
    return await this.repository.save(saveColumnData);
  }

  async findByUserId(userId: string): Promise<ColumnEntity[]> {
    return await this.repository.findBy({ userId });
  }
}

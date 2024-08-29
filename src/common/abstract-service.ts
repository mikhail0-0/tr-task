import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class AbstractService<Entity extends AbstractEntity> {
  protected abstract readonly repository: Repository<Entity>;

  abstract checkParents(params: Record<string, string>): Promise<void>;

  async findById(id: string): Promise<Entity> {
    const existEntity = await this.repository.findOneBy({
      id,
    } as FindOptionsWhere<Entity>);
    if (!existEntity) {
      throw new HttpException('Entity with id not exist', HttpStatus.NOT_FOUND);
    }
    return existEntity;
  }

  async deleteById(id: string): Promise<Entity> {
    const existEntity = await this.findById(id);
    return await this.repository.remove(existEntity);
  }
}

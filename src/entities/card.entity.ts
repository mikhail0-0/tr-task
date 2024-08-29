import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { ColumnEntity } from './column.entity';
import { AbstractEntity } from 'src/common/abstract.entity';

@Entity({ name: 'cards' })
@Unique(['name', 'columnId'])
export class CardEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'uuid' })
  columnId: string;

  @ManyToOne(() => ColumnEntity, ({ id }) => id, {
    onDelete: 'CASCADE',
  })
  column?: ColumnEntity;
}

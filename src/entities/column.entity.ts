import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { UserEntity } from './user.entity';
import { AbstractEntity } from 'src/common/abstract.entity';

@Entity({ name: 'columns' })
@Unique(['name', 'userId'])
export class ColumnEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, ({ id }) => id, {
    onDelete: 'CASCADE',
  })
  user?: UserEntity;
}

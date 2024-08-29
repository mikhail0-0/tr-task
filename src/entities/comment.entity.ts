import { Column, Entity, ManyToOne } from 'typeorm';
import { CardEntity } from './card.entity';
import { AbstractEntity } from 'src/common/abstract.entity';

@Entity({ name: 'comments' })
export class CommentEntity extends AbstractEntity {
  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'uuid' })
  cardId: string;

  @ManyToOne(() => CardEntity, ({ id }) => id, {
    onDelete: 'CASCADE',
  })
  card?: CardEntity;
}

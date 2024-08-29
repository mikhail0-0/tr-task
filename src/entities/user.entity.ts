import { Exclude, Transform } from 'class-transformer';
import { Entity, Column } from 'typeorm';
import { AbstractEntity } from 'src/common/abstract.entity';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Transform(() => undefined)
  @Column({ type: 'varchar' })
  @Exclude()
  password: string;
}

export class AuthData {
  id: string;
  email: string;
  access_token: string;
}

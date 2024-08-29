import { Column, DeleteDateColumn } from "typeorm";

export abstract class AbstractEntity {
  @Column({ type: 'uuid', generated: 'uuid', primary: true })
  id: string;
}
import { Entity, ObjectID, ObjectIdColumn, Column } from "typeorm";

@Entity()
export class Stat {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  symbol: string;

  @Column()
  price: number;

  @Column()
  volume: number;

  @Column()
  time: number;
}

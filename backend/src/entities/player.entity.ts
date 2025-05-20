// player.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, AfterInsert } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: 1000 })
  money: number;

  @Column({ default: '' })
  state: string;

  @Column({ type: 'simple-array', nullable: true })
  cards: string[];

  @Column({ default: false })
  isAI: boolean;

  @AfterInsert()
  after_insert() {
    console.log(`Player ${this.id} created`);
  }
}
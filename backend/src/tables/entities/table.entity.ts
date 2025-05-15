import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Player } from 'src/entities/player.entity';
import { Card } from './card.entity';
import { Exclude } from 'class-transformer';
import { Deck } from './deck.entity';

@Entity()
export class Table {
  constructor() {
    this.deck = new Deck(); // logique mémoire
    this.players = []; // logique mémoire
    this.river = []; // logique mémoire
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 20 })
  bigBlind: number;

  @Column({ default: 0 })
  pot: number;

  @Column({ default: 0 })
  currentBet: number;

  @Column({ default: 0 })
  currentTurn: number;

  @Column({ default: 0 })
  round: number;

  @Column({ default: 0 })
  currentRound: number;

  @Column({ default: 0 })
  currentPlayerIndex: number;

  @Column({ default: 0 })
  dealerIndex: number;

  @Exclude()
  deck: Deck;

  @Exclude()
  players: Player[];

  @Exclude()
  river: Card[];
}

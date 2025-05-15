import { Deck } from '../entities/deck.entity';
import { Player } from 'src/entities/player.entity';
import { Card } from '../entities/card.entity';

export class TableModel {
  constructor(public id: number) {
    this.deck = new Deck();
    this.players = [];
    this.river = [];
    this.pot = 0;
    this.currentBet = 0;
    this.currentTurn = 0;
    this.round = 0;
    this.currentRound = 0;
    this.currentPlayerIndex = 0;
    this.dealerIndex = 0;
  }

  deck: Deck;
  players: Player[];
  river: Card[];
  pot: number;
  currentBet: number;
  currentTurn: number;
  round: number;
  currentRound: number;
  currentPlayerIndex: number;
  dealerIndex: number;
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { TableModel } from './models/table.model';
import { DeckService } from '../deck/deck.service';
import { PlayersService } from '../players/players.service';
import { PlayerDto } from '../players/dto/players.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';

@Injectable()
export class TablesService {
  processHumanMove(
    tableId: number,
    playerId: any,
    action: string,
    parsedAmount: number | undefined,
  ) {
    throw new Error('Method not implemented.');
  }
  tables: TableModel[] = [];
  MAX_ROUNDS = 4;

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private deckService: DeckService,
    private playersService: PlayersService,
  ) {
    for (let i = 0; i < 4; i++) {
      this.createTable();
    }
  }

  createTable() {
    let table = new TableModel(this.tables.length);
    table.deck = this.deckService.shuffle(this.deckService.generateDeck());
    table.currentRound = 0;
    this.tables.push(table);
  }

  findAll() {
    return this.tables;
  }

  findOne(id: number) {
    return this.tables[id];
  }

  async join(tableId: number, playerId: number) {
    if (!this.tables[tableId]) {
      return `Table ${tableId} not found`;
    }
    if (this.tables[tableId].players.some((p) => !p.isAI)) {
      return `Un joueur humain est déjà présent à la table ${tableId}`;
    }
    let player = await this.playersService.createPlayer(playerId);
    if (!player) {
      return 'Player not found';
    }
    if (player.money < 10) {
      return 'Not enough money';
    }
    if (this.tables[tableId].players.some((p) => p.id === playerId)) {
      return `You are already in the table ${tableId}`;
    }
    this.tables[tableId].players.push(player);
    await this.startGame(tableId, playerId);
    return this.formatResponse(tableId, playerId);
  }

  async getActions(tableId: number, playerId: number) {
    const table = this.tables[tableId];
    return this.getPossibleActions(table, playerId);
  }

  async actions(
    tableId: number,
    playerId: number,
    action: string,
    amount?: number,
  ) {
    let player = this.tables[tableId].players.find((p) => p.id === playerId);
    if (!player) return `Player ${playerId} not found`;
    switch (action) {
      case 'fold':
        return await this.fold(tableId, playerId);
      case 'call':
        return await this.call(tableId, playerId);
      case 'raise':
        return await this.raise(tableId, playerId, amount);
      case 'check':
        return await this.check(tableId, playerId);
      case 'leave':
        return this.leave(tableId, playerId);
      case 'startGame':
        return this.startGame(tableId, playerId);
      case 'small_blind':
        return this.blinds(tableId, playerId, 5);
      case 'big_blind':
        return this.blinds(tableId, playerId, 10);
      default:
        return { message: 'Action not found', possibleActions: [] };
    }
  }

  async blinds(tableId: number, playerId: number, amount: number) {
    const player = this.tables[tableId].players.find((p) => p.id === playerId);
    if (!player) return `Player ${playerId} not found`;
    if (player.money < amount) return 'Not enough money';
    player.bet = amount;
    player.money -= amount;
    player.state = 'waiting';
    if (!player.isAI) {
      await this.playerRepository.update(playerId, { money: player.money });
      await this.playerRepository.save(player);
    }
    this.tables[tableId].currentBet = amount;
    this.tables[tableId].pot += amount;
    return this.formatResponse(tableId, playerId);
  }

  fold(tableId: number, playerId: number) {
    const player = this.tables[tableId].players.find((p) => p.id === playerId);
    if (!player) throw new NotFoundException(`Player ${playerId} not found`);
    player.state = 'fold';
    const endMsg = this.checkGameEnd(tableId);
    if (endMsg) return endMsg;
    return this.formatResponse(tableId, playerId);
  }

  async call(tableId: number, playerId: number, amount: number = 0) {
    const player = this.tables[tableId].players.find((p) => p.id === playerId);
    if (!player) return `Player ${playerId} not found`;
    let diff = this.tables[tableId].currentBet - player.bet;
    player.money -= diff;
    player.bet = this.tables[tableId].currentBet;
    player.state = 'waiting';
    if (!player.isAI) {
      await this.playerRepository.update(playerId, { money: player.money });
      await this.playerRepository.save(player);
    }
    this.tables[tableId].pot += diff;
    return this.formatResponse(tableId, playerId);
  }

  async raise(tableId: number, playerId: number, amount: number = 0) {
    const player = this.tables[tableId].players.find((p) => p.id === playerId);
    if (!player) throw new NotFoundException(`Player ${playerId} not found`);
    let diff = amount - player.bet;
    player.money -= diff;
    player.bet = amount;
    player.state = 'waiting';
    if (!player.isAI) {
      await this.playerRepository.update(playerId, { money: player.money });
    }
    this.tables[tableId].pot += diff;
    this.tables[tableId].currentBet = amount;
    return this.formatResponse(tableId, playerId);
  }

  check(tableId: number, playerId: number) {
    return this.formatResponse(tableId, playerId);
  }

  leave(tableId: number, playerId: number) {
    this.tables[tableId].players = this.tables[tableId].players.filter(
      (p) => p.id !== playerId,
    );
    return this.tables;
  }

  async startGame(tableId: number, currentPlayerId: number) {
    let table = this.tables[tableId];
    table.players = table.players.filter((p) => !p.isAI);
    table.currentRound = 0;
    await this.generateAI(tableId, currentPlayerId, 2);
    const players = table.players;
    if (players.length > 1) {
      const dealerPosition = Math.floor(Math.random() * players.length);
      players[dealerPosition].state = 'dealer';
      table.dealerIndex = dealerPosition;
    }
    players.forEach((player) => {
      for (let i = 0; i < 2; i++) {
        const card = this.deckService.pickCard(table.deck);
        if (card) player.hand.push(card);
      }
    });
    this.assignBlinds(tableId);
    table.currentPlayerIndex = players.findIndex(
      (p) => p.state === 'small_blind',
    );
    this.playRound(tableId);
  }

  assignBlinds(tableId: number) {
    const table = this.tables[tableId];
    const players = table.players;
    const dealerIndex = players.findIndex((p) => p.state === 'dealer');
    const smallBlindIndex = (dealerIndex + 1) % players.length;
    const bigBlindIndex = (dealerIndex + 2) % players.length;
    players.forEach((p) => (p.state = 'waiting'));
    players[dealerIndex].state = 'dealer';
    players[smallBlindIndex].state = 'small_blind';
    players[bigBlindIndex].state = 'big_blind';
  }

  private formatResponse(
    tableId: number,
    playerId: number,
  ): { table: TableModel; possibleActions: string[] } {
    const table = this.tables[tableId];
    return {
      table,
      possibleActions: this.getPossibleActions(table, playerId),
    };
  }

  private getPossibleActions(table: TableModel, playerId: number): string[] {
    const player = table.players.find((p) => p.id === playerId);
    if (!player) return [];
    const actions: string[] = [];
    if (player.state !== 'fold')
      actions.push('check', 'call', 'raise', 'fold', 'leave');
    return actions;
  }

  async playRound(
    tableId: number,
  ): Promise<{ table: TableModel; possibleActions: string[] }> {
    const table = this.tables[tableId];
    return this.formatResponse(
      tableId,
      table.players[table.currentPlayerIndex].id,
    );
  }

  checkGameEnd(tableId: number): string | undefined {
    const table = this.tables[tableId];
    const active = table.players.filter((p) => p.state !== 'fold');
    if (active.length === 1)
      return `Everyone folded, player ${active[0].username} wins ${table.pot}`;
    return;
  }

  async generateAI(tableId: number, currentPlayerId: number, count: number) {
    for (let i = 0; i < count; i++) {
      let player = await this.playersService.createAIPlayer(
        `AI${i}`,
        this.tables[tableId],
      );
      this.tables[tableId].players.push(player);
    }
  }
}

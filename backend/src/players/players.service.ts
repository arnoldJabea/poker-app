import { Injectable } from '@nestjs/common';
import { InjectRepository } from 'typeorm';
import { Repository } from 'typeorm';
import { Player } from '../entities/player.entity';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player) private repo: Repository<Player>,
    private jwtService: JwtService,
  ) {}

  async findAll() {
    return this.repo.find();
  }

  async findById(id: number): Promise<Player> {
    const player = await this.repo.findOne({ where: { id } });
    if (!player) throw new BadRequestException('Player not found');
    return player;
  }

  async motherlode(playerId: number): Promise<Player> {
    const player = await this.repo.findOne({ where: { id: playerId } });
    if (!player) throw new BadRequestException('Player not found');
    player.money += 1000;
    return this.repo.save(player);
  }

  async create(playerData: any) {
    const existing = await this.repo.findOne({ where: { username: playerData.username } });
    if (existing) throw new BadRequestException('User already exists');

    const player = this.repo.create({
      username: playerData.username,
      password: playerData.password, 
      cards: ['2_of_clubs.svg', '10_of_hearts.svg'],
    });
    return this.repo.save(player);
  }
}
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { PlayersService } from './players.service';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/AuthGuard';
import { Request } from 'express';

@ApiResponse({
  status: 200,
  description: 'Liste des joueurs ou action exécutée.',
})
@Controller('player')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.playersService.findByUsername(username);
  }

  @Get()
  findAll() {
    return this.playersService.findAll();
  }

  @Get('motherlode/:playerId')
  motherlode(@Param('playerId') playerId: string) {
    return this.playersService.motherlode(Number(playerId));
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: Request) {
    const player = await this.playersService.findById(req.user['userId']);
    return {
      id: player.id,
      username: player.username,
      money: player.money,
      cards: player.cards ?? []
    };
  }
}
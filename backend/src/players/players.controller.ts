import { Controller, Get, Param } from '@nestjs/common';
import { PlayersService } from './players.service';
import { ApiResponse } from '@nestjs/swagger';

@ApiResponse({
  status: 200,
  description: 'Liste des joueurs ou action exécutée.',
})
@Controller('player')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) { }

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
  //@UseGuards(JwtAuthGuard)
  async getMe(@Request() req: any) {
    const player = await this.playersService.findById(req.user.id);
    return player; // ✅ renvoie l'objet complet
  }
}
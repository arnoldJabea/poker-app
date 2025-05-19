import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { PlayersService } from '../../services/players/players.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  players: any[] = [];

  constructor(private playersService: PlayersService) {}

  async ngOnInit() {
    await this.loadPlayers();
  }

  async loadPlayers() {
    try {
      this.players = await this.playersService.findAll();
    } catch (error) {
      console.error('Erreur chargement joueurs', error);
    }
  }

  async giveMoney(playerId: number) {
    try {
      await this.playersService.motherlode(playerId);
      await this.loadPlayers(); // recharge les joueurs après
    } catch (error) {
      console.error('Erreur motherlode', error);
    }
  }
}
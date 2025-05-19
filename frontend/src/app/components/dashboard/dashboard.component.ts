import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersService } from '../../services/players/players.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, MatCardModule, MatButtonModule],
})
export class DashboardComponent implements OnInit {
  player: any = null;
  playerCards: string[] = ['2_of_clubs.svg', '10_of_hearts.svg', 'ace_of_spades.svg']; // 👈 ajout ici
  loading: boolean = false;
  error: string = '';

  constructor(private playersService: PlayersService) {}

  ngOnInit() {
    this.fetchPlayerData();
  }

  async fetchPlayerData() {
    try {
      this.loading = true;
      const response = await this.playersService.getMe();
      this.player = response;
      console.log('🎯 Joueur connecté :', this.player);
    } catch (err) {
      this.error = 'Erreur lors du chargement du joueur';
    } finally {
      this.loading = false;
    }
  }

  async handleMotherlode() {
    if (!this.player) return;
    this.loading = true;
    try {
      const response = await this.playersService.motherlode(this.player.id);
      this.player.money = response.money;
    } catch (err: any) {
      this.error = err?.error?.message || 'Erreur lors du motherlode';
    } finally {
      this.loading = false;
    }
  }

  get avatarUrl(): string {
    return `https://api.dicebear.com/7.x/thumbs/svg?seed=${this.player?.username || 'default'}`;
  }
}
// =====================================================================
// Importing Angular modules and third-party dependencies
// =====================================================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';

import { TablesService } from '../../../services/tables/tables.service';

// =====================================================================
// StartGameComponent Component Declaration
// =====================================================================
@Component({
  selector: 'app-start-game',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatToolbarModule,
  ],
  templateUrl: './start-game.component.html',
  styleUrl: './start-game.component.scss'
})
export class StartGameComponent {
  // ---------------------------------------------------------------------
  // Component constructor
  // Injecting the services UsersService, Router and MatSnackBar
  // ---------------------------------------------------------------------
  constructor(
    private tablesService: TablesService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  isSubmitting = false;

  startGameForm = new FormGroup({
    name_game: new FormControl('', [Validators.required]),
    number_players: new FormControl('', [Validators.required]),
    starting_bet: new FormControl('', [Validators.required]),
    betting_limit: new FormControl('', [Validators.required]),
    game_mode: new FormControl('', [Validators.required]),
    duration_game: new FormControl('', [Validators.required]),
  });

  async startGame() {
    if (!this.startGameForm.valid) {
      this.snackBar.open("Formulaire invalide. Veuillez vérifier les champs.", "Fermer", {
        duration: 5000,
        panelClass: ['snackbar-error'],
      });
      return;
    }

    if (this.isSubmitting) return;

    this.isSubmitting = true;

    try {

      const newGame = {
        name_game: this.startGameForm.value.name_game ?? '',
        number_players: this.startGameForm.value.number_players ?? '',
        starting_bet: this.startGameForm.value.starting_bet ?? '',
        betting_limit: this.startGameForm.value.betting_limit ?? '',
        game_mode: this.startGameForm.value.game_mode ?? '',
        duration_game: this.startGameForm.value.duration_game ?? ''
      };

      // await this.tablesService.create(newGame);
      this.snackBar.open("Les informations ont bien été enregistrée et pris en comptes !", "Fermer", {
        duration: 5000,
        panelClass: ['snackbar-success'],
      });

      this.startGameForm.reset();
      this.router.navigate(['/game-in-progress']);
    } catch (error) {
      this.snackBar.open("Erreur lors de l'inscription.", "Fermer", {
        duration: 5000,
        panelClass: ['snackbar-error'],
      });
    } finally {
      this.isSubmitting = false;
    }
  }

}

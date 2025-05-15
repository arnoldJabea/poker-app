import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../services/auth/auth.service';

const VISIBILITY = {
  VISIBLE: 'visibility',
  INVISIBLE: 'visibility_off',
};

const VISIBILITY_TYPE = {
  VISIBLE: 'text',
  INVISIBLE: 'password',
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatDividerModule,
    MatToolbarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  passwordVisibility = VISIBILITY.INVISIBLE;
  passwordInputType = VISIBILITY_TYPE.INVISIBLE;

  async login() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    try {
      const response = await this.authService.login({ username, password });

      if (response.access_token) {
        this.authService.setSessionToken(response.access_token); // Stockage du token JWT
        this.snackBar.open("Connexion réussie !", "Fermer", {
          duration: 5000,
          panelClass: ['snackbar-success'],
        });
        this.router.navigate(['/accueil']);
      }
    } catch (error) {
      this.snackBar.open("Erreur lors de la connexion : identifiants invalides", "Fermer", {
        duration: 5000,
        panelClass: ['snackbar-error'],
      });
    }
  }

  togglePasswordVisibility() {
    if (this.passwordVisibility === VISIBILITY.INVISIBLE) {
      this.passwordInputType = VISIBILITY_TYPE.VISIBLE;
      this.passwordVisibility = VISIBILITY.VISIBLE;
    } else {
      this.passwordInputType = VISIBILITY_TYPE.INVISIBLE;
      this.passwordVisibility = VISIBILITY.INVISIBLE;
    }
  }
}

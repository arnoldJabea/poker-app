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

import { AuthService } from '../../../services/auth/auth.service';

// =====================================================================
// Defining constants for visibility management
// =====================================================================
const VISIBILITY = {
  VISIBLE: 'visibility',
  INVISIBLE: 'visibility_off',
};

// =====================================================================
// Defining constants for password input field type
// =====================================================================
const VISIBILITY_TYPE = {
  VISIBLE: 'text',
  INVISIBLE: 'password',
};

// =====================================================================
// RegisterGeneraleComponent Component Declaration
// =====================================================================
@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  // ---------------------------------------------------------------------
  // Component constructor
  // Injecting the services UsersService, Router and MatSnackBar
  // ---------------------------------------------------------------------
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  isSubmitting = false;

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    nom: new FormControl('', [Validators.required]),
    prenom: new FormControl('', [Validators.required]),
    date_naissance: new FormControl('', [Validators.required]),
    pays: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(12)]),
    confirm_password: new FormControl('', [Validators.required, Validators.minLength(12)])
  });

  passwordVisibility = VISIBILITY.INVISIBLE;
  passwordInputType = VISIBILITY_TYPE.INVISIBLE;
  confirmPasswordVisibility = VISIBILITY.INVISIBLE;
  confirmPasswordInputType = VISIBILITY_TYPE.INVISIBLE;

  async register() {
    if (!this.registerForm.valid) {
      this.snackBar.open("Formulaire invalide. Veuillez vérifier les champs.", "Fermer", {
        duration: 5000,
        panelClass: ['snackbar-error'],
      });
      return;
    }

    if (this.isSubmitting) return;

    this.isSubmitting = true;

    try {
      const { password, confirm_password, ...rest } = this.registerForm.value;

      if (password !== confirm_password) {
        this.snackBar.open("Les mots de passe ne correspondent pas.", "Fermer", {
          duration: 5000,
          panelClass: ['snackbar-error'],
        });
        return;
      }

      const newUser = {
        username: this.registerForm.value.username ?? '',
        nom: this.registerForm.value.nom ?? '',
        prenom: this.registerForm.value.prenom ?? '',
        date_naissance: this.registerForm.value.date_naissance ?? '',
        pays: this.registerForm.value.pays ?? '',
        email: this.registerForm.value.email ?? '',
        password: this.registerForm.value.password ?? ''
      };

      await this.authService.signUp(newUser);
      this.snackBar.open("Inscription réussie !", "Fermer", {
        duration: 5000,
        panelClass: ['snackbar-success'],
      });

      this.registerForm.reset();
      this.router.navigate(['/accueil']);
    } catch (error) {
      this.snackBar.open("Erreur lors de l'inscription.", "Fermer", {
        duration: 5000,
        panelClass: ['snackbar-error'],
      });
    } finally {
      this.isSubmitting = false;
    }
  }

  // ---------------------------------------------------------------------
  // Method: togglePasswordVisibility
  // Toggles the password display between visible and hidden
  // ---------------------------------------------------------------------
  togglePasswordVisibility() {
    if (this.passwordVisibility == VISIBILITY.INVISIBLE) {
      this.passwordInputType = VISIBILITY_TYPE.VISIBLE;
      this.passwordVisibility = VISIBILITY.VISIBLE;
    } else {
      this.passwordInputType = VISIBILITY_TYPE.INVISIBLE;
      this.passwordVisibility = VISIBILITY.INVISIBLE;
    }
  }

  // ---------------------------------------------------------------------
  // Method: toggleConfirmPasswordVisibility
  // Toggles the password display between visible and hidden
  // ---------------------------------------------------------------------
  toggleConfirmPasswordVisibility() {
    if (this.confirmPasswordVisibility == VISIBILITY.INVISIBLE) {
      this.confirmPasswordInputType = VISIBILITY_TYPE.VISIBLE;
      this.confirmPasswordVisibility = VISIBILITY.VISIBLE;
    } else {
      this.confirmPasswordInputType = VISIBILITY_TYPE.INVISIBLE;
      this.confirmPasswordVisibility = VISIBILITY.INVISIBLE;
    }
  }

}

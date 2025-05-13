// =====================================================================
// Importing Angular modules and third-party dependencies
// =====================================================================
import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Subscription } from 'rxjs';

// =====================================================================
// Header Component Declaration
// =====================================================================
@Component({
  selector: 'app-header',
  imports: [
      CommonModule,
      ReactiveFormsModule,
      MatButtonModule,
      MatSelectModule,
      MatMenuModule,
      MatIconModule,
      MatToolbarModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  // -------------------------------------------------------------------
  // Component constructor
  // -------------------------------------------------------------------
  constructor(
    private router: Router
  ) {}

  // -------------------------------------------------------------------
  // Redirects to different pages
  // -------------------------------------------------------------------
  redirectHome() {
    this.router.navigate(['/accueil']);
  }

  // -------------------------------------------------------------------
  // Redirects for registration and login
  // -------------------------------------------------------------------
  redirectRegister() {
    this.router.navigate(['/authentification/register/register-main']);
  }

  redirectLogin() {
    this.router.navigate(['/authentification/login']);
  }

}

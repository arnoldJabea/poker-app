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

import { AuthService } from '../../../services/auth/auth.service';

// =====================================================================
// Header Component Declaration
// =====================================================================
@Component({
  selector: 'app-header',
  standalone: true,
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
export class HeaderComponent implements OnInit, OnDestroy {

  // -------------------------------------------------------------------
  // Attributes and instance variables
  // -------------------------------------------------------------------
  @ViewChild('sidenav') sidenav!: ElementRef<HTMLDivElement>;

  @Inject(MAT_DIALOG_DATA) public element: any

  private sessionSubscription!: Subscription;

  session = {
    prenom: '',
    nom: '',
    role: '',
    isAuthenticated: false
  };

  // -------------------------------------------------------------------
  // Component constructor
  // -------------------------------------------------------------------
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  // -------------------------------------------------------------------
  // Access methods
  // Checks if the user has the specified role
  // -------------------------------------------------------------------
  canAccess(role: string): boolean {
    return this.session.role === role;
  }

  // -------------------------------------------------------------------
  // User Logout
  // Calls the logout service and then redirects to the login page
  // -------------------------------------------------------------------
  async logout() {
    try {
      await this.authService.logout();
      this.session.isAuthenticated = false;
      this.session.role = '';
      this.router.navigate(['/authentification/login']);
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  }

  // -------------------------------------------------------------------
  // Side menu management (sidenav)
  // -------------------------------------------------------------------
  openSidenav() {
    if (this.sidenav) {
      this.sidenav.nativeElement.style.width = '100vw';
    }
  }

  closeSidenav() {
    if (this.sidenav) {
      this.sidenav.nativeElement.style.width = '0';
    }
  }

  // -------------------------------------------------------------------
  // Redirects to different pages
  // -------------------------------------------------------------------
  redirectHome() {
    this.router.navigate(['/home']);
  }

  // -------------------------------------------------------------------
  // Redirects for registration and login
  // -------------------------------------------------------------------
  redirectRegister() {
    this.router.navigate(['/authentification/register']);
  }

  redirectLogin() {
    this.router.navigate(['/authentification/login']);
  }

  // -------------------------------------------------------------------
  // Component Lifecycle: Initialization
  // Subscription to session changes
  // -------------------------------------------------------------------
  async ngOnInit() {
    this.sessionSubscription = this.authService.session$.subscribe(
      (session) => {
        this.session = session;
      }
    );
  }

  // -------------------------------------------------------------------
  // Component lifecycle: Destruction
  // Clean up subscriptions to avoid memory leaks
  // -------------------------------------------------------------------

  ngOnDestroy() {
    if (this.sessionSubscription) {
      this.sessionSubscription.unsubscribe();
    }
  }

}

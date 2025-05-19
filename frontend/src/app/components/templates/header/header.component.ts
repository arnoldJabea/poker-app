import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';

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
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: ElementRef<HTMLDivElement>;

  private sessionSubscription!: Subscription;

  session = {
    prenom: '',
    nom: '',
    role: '',
    isAuthenticated: false,
  };

  constructor(private router: Router, private authService: AuthService) { }

  canAccess(role: string): boolean {
    return this.session.role === role;
  }

  async logout() {
    this.authService.logout();
    this.session.isAuthenticated = true;
    this.session.role = '';
    this.router.navigate(['/authentification/login']);
  }

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

  redirectHome() {
    this.router.navigate(['/home']);
  }

  redirectRegister() {
    this.router.navigate(['/register']);
  }

  redirectLogin() {
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.sessionSubscription = this.authService.session$.subscribe((session) => {
      this.session = session;
    });
  }

  ngOnDestroy() {
    if (this.sessionSubscription) {
      this.sessionSubscription.unsubscribe();
    }
  }
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
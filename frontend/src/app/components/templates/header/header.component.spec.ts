import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth/auth.service';
import { of } from 'rxjs';
import { ElementRef } from '@angular/core';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockMatDialog {}

class MockAuthService {
  session$ = of({
    prenom: 'Jean',
    nom: 'Dupont',
    role: 'admin',
    isAuthenticated: true
  });

  logout = jasmine.createSpy('logout').and.returnValue(Promise.resolve());
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: MockRouter;
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as any;
    router = TestBed.inject(Router) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive session data from AuthService', () => {
    expect(component.session.prenom).toBe('Jean');
    expect(component.session.isAuthenticated).toBeTrue();
  });

  it('should check access based on role', () => {
    component.session.role = 'admin';
    expect(component.canAccess('admin')).toBeTrue();
    expect(component.canAccess('user')).toBeFalse();
  });

  it('should call router.navigate on redirectHome()', () => {
    component.redirectHome();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should call router.navigate on redirectLogin()', () => {
    component.redirectLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/authentification/login']);
  });

  it('should call logout and navigate to login', async () => {
    await component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/authentification/login']);
    expect(component.session.isAuthenticated).toBeFalse();
  });

  it('should open sidenav', () => {
    const mockDiv = document.createElement('div');
    const nativeElement = new ElementRef(mockDiv);
    component.sidenav = nativeElement;
    component.openSidenav();
    expect(mockDiv.style.width).toBe('100vw');
  });

  it('should close sidenav', () => {
    const mockDiv = document.createElement('div');
    const nativeElement = new ElementRef(mockDiv);
    component.sidenav = nativeElement;
    component.closeSidenav();
    expect(mockDiv.style.width).toBe('0');
  });
});

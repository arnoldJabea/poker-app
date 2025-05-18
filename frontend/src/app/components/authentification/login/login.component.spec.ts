import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth/auth.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// Mocks
class MockAuthService {
  login = jasmine.createSpy().and.returnValue(of({ access_token: 'fake-token' }).toPromise());
  setSessionToken = jasmine.createSpy();
}
class MockRouter {
  navigate = jasmine.createSpy();
}
class MockMatSnackBar {
  open = jasmine.createSpy();
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: MockAuthService;
  let router: MockRouter;
  let snackBar: MockMatSnackBar;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, FormsModule, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        { provide: MatSnackBar, useClass: MockMatSnackBar }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authService = TestBed.inject(AuthService) as any;
    router = TestBed.inject(Router) as any;
    snackBar = TestBed.inject(MatSnackBar) as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    const originalType = component.passwordInputType;
    component.togglePasswordVisibility();
    expect(component.passwordInputType).not.toBe(originalType);
  });

  it('should not login if form is invalid', async () => {
    component.loginForm.setValue({ username: '', password: '' });
    await component.login();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should login and navigate on success', async () => {
    component.loginForm.setValue({ username: 'user', password: 'pass' });
    await component.login();

    expect(authService.login).toHaveBeenCalledWith({ username: 'user', password: 'pass' });
    expect(authService.setSessionToken).toHaveBeenCalledWith('fake-token');
    expect(snackBar.open).toHaveBeenCalledWith("Connexion réussie !", "Fermer", jasmine.any(Object));
    expect(router.navigate).toHaveBeenCalledWith(['/accueil']);
  });

  it('should show error snackbar on login failure', async () => {
    authService.login = jasmine.createSpy().and.returnValue(Promise.reject('Erreur'));
    component.loginForm.setValue({ username: 'user', password: 'pass' });

    await component.login();

    expect(snackBar.open).toHaveBeenCalledWith(
      "Erreur lors de la connexion : identifiants invalides",
      "Fermer",
      jasmine.any(Object)
    );
  });
});

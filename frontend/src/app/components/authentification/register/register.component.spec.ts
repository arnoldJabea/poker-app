import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services/auth/auth.service';

// Mock
class MockAuthService {
  signUp = jasmine.createSpy().and.returnValue(Promise.resolve({ access_token: 'mock-token' }));
}

class MockRouter {
  navigate = jasmine.createSpy();
}

class MockMatSnackBar {
  open = jasmine.createSpy();
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: MockAuthService;
  let router: MockRouter;
  let snackBar: MockMatSnackBar;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule, FormsModule, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authService = TestBed.inject(AuthService) as any;
    router = TestBed.inject(Router) as any;
    snackBar = TestBed.inject(MatSnackBar) as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', async () => {
    component.registerForm.setValue({
      username: '',
      nom: '',
      prenom: '',
      date_naissance: '',
      pays: '',
      email: '',
      password: '',
      confirm_password: ''
    });

    await component.register();

    expect(authService.signUp).not.toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith(
      'Formulaire invalide. Veuillez vérifier les champs.',
      'Fermer',
      jasmine.any(Object)
    );
  });

  it('should show error if passwords do not match', async () => {
    component.registerForm.patchValue({
      username: 'test',
      nom: 'Doe',
      prenom: 'John',
      date_naissance: '2000-01-01',
      pays: 'France',
      email: 'test@example.com',
      password: 'Password1234',
      confirm_password: 'NotTheSame1234'
    });

    await component.register();

    expect(authService.signUp).not.toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith(
      'Les mots de passe ne correspondent pas.',
      'Fermer',
      jasmine.any(Object)
    );
  });

  it('should call authService.signUp and navigate on success', async () => {
    component.registerForm.setValue({
      username: 'user',
      nom: 'Dupont',
      prenom: 'Jean',
      date_naissance: '1990-12-12',
      pays: 'France',
      email: 'jean@dupont.fr',
      password: 'MotDePasse123',
      confirm_password: 'MotDePasse123'
    });

    await component.register();

    expect(authService.signUp).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith(
      'Inscription réussie !',
      'Fermer',
      jasmine.any(Object)
    );
    expect(router.navigate).toHaveBeenCalledWith(['/accueil']);
  });

  it('should show error snackbar on signUp failure', async () => {
    authService.signUp = jasmine.createSpy().and.returnValue(Promise.reject('Erreur serveur'));

    component.registerForm.setValue({
      username: 'user',
      nom: 'Dupont',
      prenom: 'Jean',
      date_naissance: '1990-12-12',
      pays: 'France',
      email: 'jean@dupont.fr',
      password: 'MotDePasse123',
      confirm_password: 'MotDePasse123'
    });

    await component.register();

    expect(snackBar.open).toHaveBeenCalledWith(
      "Erreur lors de l'inscription.",
      'Fermer',
      jasmine.any(Object)
    );
  });

  it('should toggle password visibility', () => {
    const initial = component.passwordInputType;
    component.togglePasswordVisibility();
    expect(component.passwordInputType).not.toBe(initial);
  });

  it('should toggle confirm password visibility', () => {
    const initial = component.confirmPasswordInputType;
    component.toggleConfirmPasswordVisibility();
    expect(component.confirmPasswordInputType).not.toBe(initial);
  });
});

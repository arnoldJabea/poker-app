import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';

import { isAuthorizedGuard } from './is-authorized.guard';
import { AuthService } from '../../services/auth/auth.service';
import { Roles } from './roles';

describe('isAuthorizedGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const createRouteSnapshot = (data: any): ActivatedRouteSnapshot => {
    return { data } as ActivatedRouteSnapshot;
  };

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['session$'], { session$: of(null) });
    const navSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: navSpy }
      ]
    });

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access for non-authenticated user when Roles.NonLoggedUser is allowed', async () => {
    authServiceSpy.session$ = of({
      isAuthenticated: false,
      role: '',
      prenom: '',
      nom: ''
    });

    const route = createRouteSnapshot({
      authorize: [Roles.NonLoggedUser],
      fallbackRoute: '/login'
    });

    const result = await isAuthorizedGuard(route);
    expect(result).toBeTrue();
  });

  it('should deny access for non-authenticated user when NonLoggedUser is not allowed and navigate', async () => {
    authServiceSpy.session$ = of({
      isAuthenticated: false,
      role: '',
      prenom: '',
      nom: ''
    });

    const route = createRouteSnapshot({
      authorize: [Roles.Admin],
      fallbackRoute: '/login'
    });

    const result = await isAuthorizedGuard(route);
    expect(result).toBeFalse();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should allow access for authenticated user with sufficient role (minimunRoleMode)', async () => {
    authServiceSpy.session$ = of({
      isAuthenticated: false,
      role: 'Admin',
      prenom: '',
      nom: ''
    });

    const route = createRouteSnapshot({
      authorize: [Roles.LoggedUser],
      fallbackRoute: '/unauthorized'
    });

    const result = await isAuthorizedGuard(route);
    expect(result).toBeTrue();
  });

  it('should deny access for authenticated user with insufficient role (minimunRoleMode)', async () => {
    authServiceSpy.session$ = of({
      isAuthenticated: false,
      role: 'LoggedUser',
      prenom: '',
      nom: ''
    });

    const route = createRouteSnapshot({
      authorize: [Roles.Admin],
      fallbackRoute: '/unauthorized'
    });

    const result = await isAuthorizedGuard(route);
    expect(result).toBeFalse();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/unauthorized');
  });

  it('should allow access when user role is explicitly included (non-minimunRoleMode)', async () => {
    authServiceSpy.session$ = of({
      isAuthenticated: false,
      role: 'Moderator',
      prenom: '',
      nom: ''
    });

    const route = createRouteSnapshot({
      authorize: [Roles.LoggedUser, Roles.Moderator],
      minimunRoleMode: false,
      fallbackRoute: '/unauthorized'
    });

    const result = await isAuthorizedGuard(route);
    expect(result).toBeTrue();
  });

  it('should deny access when user role is not in allowed list (non-minimunRoleMode)', async () => {
    authServiceSpy.session$ = of({
      isAuthenticated: false,
      role: 'LoggedUser',
      prenom: '',
      nom: ''
    });

    const route = createRouteSnapshot({
      authorize: [Roles.Admin],
      minimunRoleMode: false,
      fallbackRoute: '/unauthorized'
    });

    const result = await isAuthorizedGuard(route);
    expect(result).toBeFalse();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/unauthorized');
  });

  it('should throw error when minimunRoleMode is true and multiple roles are provided', async () => {
    authServiceSpy.session$ = of({
      isAuthenticated: false,
      role: 'Admin',
      prenom: '',
      nom: ''
    });

    const route = createRouteSnapshot({
      authorize: [Roles.LoggedUser, Roles.Admin],
      minimunRoleMode: true,
      fallbackRoute: '/unauthorized'
    });

    await expectAsync(isAuthorizedGuard(route)).toBeRejectedWithError(
      "[isAuthorizedGuard] Can't declare more than one role in minimunRoleMode."
    );
  });
});

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';
import { Roles } from './roles';

export const isAuthorizedGuard = async (route: ActivatedRouteSnapshot) => {
  const roles: Roles[] = route.data['authorize'];
  const minimunRoleMode: boolean = route.data['minimunRoleMode'] ?? true;
  const fallbackRoute: string = route.data['fallbackRoute'] ?? '';

  return validate(roles, minimunRoleMode, fallbackRoute);
};

async function validate(roles: Roles[], minimunRoleMode: boolean, fallbackRoute: string): Promise<boolean> {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Récupération de la session actuelle depuis le BehaviorSubject
  const session = await firstValueFrom(authService.session$);

  if (!session.isAuthenticated) {
    if (roles.includes(Roles.NonLoggedUser)) return true;
    router.navigateByUrl(fallbackRoute);
    return false;
  }

  const userRoleStr = session.role;
  const userRoleNumber = Roles[userRoleStr as keyof typeof Roles];

  if (!roles || !userRoleStr) return false;

  let isAuthorized = false;

  if (minimunRoleMode) {
    if (roles.length !== 1) {
      throw new Error("[isAuthorizedGuard] Can't declare more than one role in minimunRoleMode.");
    }
    isAuthorized = userRoleNumber >= roles[0];
  } else {
    isAuthorized = roles.includes(userRoleNumber);
  }

  if (!isAuthorized) {
    router.navigateByUrl(fallbackRoute);
  }

  return isAuthorized;
}

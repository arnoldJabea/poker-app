// =====================================================================
//                          GENERAL IMPORTS
// =====================================================================

// ---------------------------------------------------------------------
// Angular Module and Routing Management
// ---------------------------------------------------------------------
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ---------------------------------------------------------------------
// Importing components (pages and features)
// ---------------------------------------------------------------------
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/authentification/register/register.component';
import { LoginComponent } from './components/authentification/login/login.component';

// =====================================================================
//                    IMPORTS OF GUARDS AND ROLES
// =====================================================================

// ---------------------------------------------------------------------
// Guard for authorization management and role definition
// ---------------------------------------------------------------------
import { isAuthorizedGuard } from './guards/IsAuthorized/is-authorized.guard';
import { Roles } from './guards/IsAuthorized/roles';

/*****************************************************************************************************/
// =====================================================================
//                    CONFIGURING APPLICATION ROUTES
// =====================================================================
export const routes: Routes = [
  // ---------------------------------------------------------------------
  // Redirect default route to "home"
  // ---------------------------------------------------------------------
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // ---------------------------------------------------------------------
  // Routes for displaying static or main pages
  // ---------------------------------------------------------------------
  { path: 'home', component: HomeComponent },

  // ---------------------------------------------------------------------
  // Authentication routes (registration and login)
  // ---------------------------------------------------------------------
  {
    path: 'authentification/register',
    component: RegisterComponent,
    canActivate: [isAuthorizedGuard],
    data: {
      authorize: [Roles.NonLoggedUser],
      minimunRoleMode: false,
      fallbackRoute: 'home',
    },
  },
  {
    path: 'authentification/login',
    component: LoginComponent,
    canActivate: [isAuthorizedGuard],
    data: {
      authorize: [Roles.NonLoggedUser],
      minimunRoleMode: false,
      fallbackRoute: 'home',
    },
  }
];

/*****************************************************************************************************/
// =====================================================================
//                 ROUTING MODULE DECLARATION
// =====================================================================
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

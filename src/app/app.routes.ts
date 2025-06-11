import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';
import { UserRole } from './auth/auth.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/balances',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: 'balances',
    loadComponent: () => import('./features/balances/balances.component').then(m => m.BalancesComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.USER }
  },  {
    path: 'upload',
    loadComponent: () => import('./features/upload/upload.component').then(m => m.UploadComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.ADMIN }
  },
  {
    path: '**',
    redirectTo: '/balances'
  }
];

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService, UserRole } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRole = route.data['role'] as UserRole;
    
    return this.authService.getUserRole$().pipe(
      map(userRole => {
        if (requiredRole === UserRole.ADMIN && userRole === UserRole.ADMIN) {
          return true;
        }
        if (requiredRole === UserRole.USER) {
          // Both admin and user can access user pages
          return true;
        }
        return false;
      }),
      tap(hasAccess => {
        if (!hasAccess) {
          this.router.navigate(['/unauthorized']);
        }
      })
    );
  }
}

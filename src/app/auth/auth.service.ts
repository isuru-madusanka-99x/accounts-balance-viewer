import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, startWith } from 'rxjs/operators';

export enum UserRole {
  ADMIN = 'Admin',
  USER = 'Viewer'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth0: Auth0Service) {}

  // Check if user is authenticated
  get isAuthenticated$(): Observable<boolean> {
    return this.auth0.isAuthenticated$;
  }

  // Get user profile
  get user$() {
    return this.auth0.user$;
  }

  // Get user roles from Auth0 user metadata
  getUserRole$(): Observable<UserRole> {
    return this.auth0.user$.pipe(
      map(user => {
        if (!user) return UserRole.USER;
        
        // Auth0 custom claims should be namespaced
        const roles = user['https://schemas.accountsbalanceviewer.com/roles'] || user['app_metadata']?.roles || [];
        
        if (Array.isArray(roles) && roles.includes(UserRole.ADMIN)) {
          return UserRole.ADMIN;
        }
        return UserRole.USER;
      }),
      catchError(() => of(UserRole.USER)) // Add error handling
    );
  }

  // Check if user is admin
  get isAdmin$(): Observable<boolean> {
    return this.getUserRole$().pipe(
      map(role => role === UserRole.ADMIN),
      startWith(false), // Add initial value
      distinctUntilChanged() // Prevent unnecessary emissions
    );
  }

  // Check if user is regular user (includes admins)
  canViewBalances$(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  // Login
  login(): void {
    this.auth0.loginWithRedirect();
  }

  // Signup
  signup(): void {
    this.auth0.loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup'
      }
    });
  }

  // Logout
  logout(): void {
    this.auth0.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }
}

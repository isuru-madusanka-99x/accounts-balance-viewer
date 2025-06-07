import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
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
        const roles = user['https://yourapp.com/roles'] || user['app_metadata']?.roles || [];
        
        if (Array.isArray(roles) && roles.includes(UserRole.ADMIN)) {
          return UserRole.ADMIN;
        }
        return UserRole.USER;
      })
    );
  }

  // Check if user is admin
  isAdmin$(): Observable<boolean> {
    return this.getUserRole$().pipe(
      map(role => role === UserRole.ADMIN)
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

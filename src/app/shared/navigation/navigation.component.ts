import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" *ngIf="authService.isAuthenticated$ | async">
      <div class="nav-container">
        <a routerLink="/balances" class="nav-brand">
          <span class="brand-icon">💰</span>
          Accounts Balance Viewer
        </a>
        
        <div class="nav-links">
          <a routerLink="/balances" 
             routerLinkActive="active" 
             class="nav-link">
            <span class="link-icon">📊</span>
            View Balances
          </a>
          <a routerLink="/upload" 
             routerLinkActive="active" 
             class="nav-link"
             *ngIf="isAdmin$ | async">
            <span class="link-icon">📤</span>
            Upload Balances
          </a>
          
          <a routerLink="/reports" 
             routerLinkActive="active" 
             class="nav-link"
             *ngIf="isAdmin$ | async">
            <span class="link-icon">📈</span>
            Reports
          </a>
        </div>
        <div class="nav-user" *ngIf="authService.user$ | async as user">
          <div class="user-info">
            <span class="user-name">{{ user.name || user.email }}</span>
            <span class="user-role" *ngIf="isAdmin$ | async">Admin</span>
            <span class="user-role user-role-regular" *ngIf="!(isAdmin$ | async)">User</span>
          </div>
          <button class="btn btn-logout" (click)="logout()">
            <span class="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
    }
    
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      font-weight: bold;
      color: white;
      text-decoration: none;
      transition: opacity 0.3s ease;
    }
    
    .nav-brand:hover {
      opacity: 0.9;
    }
    
    .brand-icon {
      font-size: 1.5rem;
    }
    
    .nav-links {
      display: flex;
      gap: 0.5rem;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
      text-decoration: none;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-weight: 500;
    }
    
    .nav-link:hover,
    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }
    
    .link-icon {
      font-size: 1.1rem;
    }
    
    .nav-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }
    
    .user-name {
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .user-role {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-weight: 600;
      background-color: #ffc107;
      color: #212529;
    }
    
    .user-role-regular {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
    }
    
    .btn-logout {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .btn-logout:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }
    
    .logout-icon {
      font-size: 1rem;
    }
    
    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        gap: 1rem;
      }
      
      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .user-info {
        align-items: center;
        text-align: center;
      }
    }
  `]
})
export class NavigationComponent implements OnInit {
  isAdmin$;

  constructor(public authService: AuthService) {
    this.isAdmin$ = this.authService.isAdmin$;
  }

  ngOnInit() {
    this.isAdmin$.subscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}

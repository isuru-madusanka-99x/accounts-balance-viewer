import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-card">
        <div class="icon-container">
          <span class="warning-icon">🚫</span>
        </div>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <p class="hint">This page is restricted to admin users only.</p>
        <div class="button-group">
          <button class="btn btn-primary" (click)="goToBalances()">
            View Balances
          </button>
          <button class="btn btn-secondary" (click)="goBack()">
            Go Back
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 80px);
      background-color: #f8f9fa;
      padding: 20px;
    }
    
    .unauthorized-card {
      background: white;
      padding: 3rem;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 450px;
      width: 100%;
    }
    
    .icon-container {
      margin-bottom: 1.5rem;
    }
    
    .warning-icon {
      font-size: 4rem;
      opacity: 0.7;
    }
    
    h2 {
      color: #dc3545;
      margin-bottom: 1rem;
      font-size: 1.8rem;
    }
    
    p {
      color: #6c757d;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }
    
    .hint {
      font-size: 0.95rem;
      font-style: italic;
      margin-bottom: 2rem;
    }
    
    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s ease;
      min-width: 120px;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
    
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    
    .btn-secondary:hover {
      background-color: #545b62;
      transform: translateY(-2px);
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack(): void {
    history.back();
  }
  
  goToBalances(): void {
    this.router.navigate(['/balances']);
  }
}

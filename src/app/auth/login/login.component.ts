import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Accounts Balance Viewer</h1>
        <p class="subtitle">Please sign in to access your account balances</p>
        
        <div class="button-group">
          <button class="btn btn-primary" (click)="login()">
            <i class="icon">🔐</i>
            Sign In
          </button>
          <button class="btn btn-secondary" (click)="signup()">
            <i class="icon">👤</i>
            Sign Up
          </button>
        </div>
        
        <div class="info-section">
          <h3>Access Levels:</h3>
          <div class="role-info">
            <div class="role-item">
              <strong>👥 Regular Users:</strong> View account balances
            </div>
            <div class="role-item">
              <strong>🔧 Admin Users:</strong> Upload balances and view reports
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .login-card {
      background: white;
      padding: 3rem;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 450px;
      width: 100%;
    }
    
    h1 {
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }
    
    .subtitle {
      color: #666;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }
    
    .button-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 14px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s ease;
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
      background-color: #f8f9fa;
      color: #495057;
      border: 2px solid #dee2e6;
    }
    
    .btn-secondary:hover {
      background-color: #e9ecef;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }
    
    .icon {
      font-size: 18px;
    }
    
    .info-section {
      background-color: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: left;
    }
    
    .info-section h3 {
      margin: 0 0 1rem 0;
      color: #495057;
      font-size: 1.1rem;
    }
    
    .role-info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .role-item {
      font-size: 0.95rem;
      color: #6c757d;
    }
    
    .role-item strong {
      color: #495057;
    }
  `]
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  login(): void {
    this.authService.login();
  }

  signup(): void {
    this.authService.signup();
  }
}

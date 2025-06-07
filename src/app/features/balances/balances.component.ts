import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Balance, BalanceService } from '../../shared/services/balance.service';

@Component({
  selector: 'app-balances',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="balances-container">
      <div class="header">
        <h2>Account Balances</h2>
        <p class="subtitle">View current balances for each account</p>
      </div>
      
      <div class="content-card">
        <!-- Loading state -->
        <div class="loading-state" *ngIf="isLoading">
          <span class="loading-icon">⏳</span>
          <h3>Loading balances...</h3>
        </div>

        <!-- Error state -->
        <div class="error-state" *ngIf="errorMessage">
          <span class="error-icon">❌</span>
          <h3>Error Loading Balances</h3>
          <p>{{ errorMessage }}</p>
          <button class="btn btn-retry" (click)="loadBalances()">Try Again</button>
        </div>

        <!-- Balances grid -->
        <div class="balance-grid" *ngIf="!isLoading && !errorMessage && balances.length > 0">
          <div class="balance-item" *ngFor="let account of balances">
            <div class="account-info">
              <h3>{{ account.name }}</h3>
              <p class="account-number">{{ account.number }}</p>
            </div>
            <div class="balance-info">
              <span class="balance-amount" [class.negative]="account.balance < 0">
                {{ account.balance | currency }}
              </span>
              <span class="balance-status" [class]="account.balance >= 0 ? 'positive' : 'negative'">
                {{ account.balance >= 0 ? '📈' : '📉' }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Empty state -->
        <div class="empty-state" *ngIf="!isLoading && !errorMessage && balances.length === 0">
          <span class="empty-icon">📊</span>
          <h3>No Account Balances</h3>
          <p>No balance data is currently available. Please contact an administrator to upload balance data.</p>
        </div>
        
        <div class="info-note" *ngIf="!isLoading && !errorMessage">
          <p><strong>Note:</strong> Balance data is updated by administrators. If you notice any discrepancies, please contact support.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .balances-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .header h2 {
      color: #333;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      color: #666;
      font-size: 1.1rem;
    }
    
    .content-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .loading-state, .error-state {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .loading-icon, .error-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      display: block;
    }

    .error-state h3 {
      color: #dc3545;
    }

    .btn-retry {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      margin-top: 1rem;
      transition: background-color 0.3s ease;
    }

    .btn-retry:hover {
      background: #5a6fd8;
    }
    
    .balance-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .balance-item {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-left: 4px solid #667eea;
      transition: transform 0.3s ease;
    }
    
    .balance-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }
    
    .account-info h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.2rem;
    }
    
    .account-number {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
    }
    
    .balance-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }
    
    .balance-amount {
      font-size: 1.5rem;
      font-weight: bold;
      color: #28a745;
    }
    
    .balance-amount.negative {
      color: #dc3545;
    }
    
    .balance-status {
      font-size: 1.5rem;
    }
    
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
    
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      display: block;
    }
    
    .empty-state h3 {
      margin: 1rem 0;
      color: #333;
    }
    
    .info-note {
      background: #e3f2fd;
      border-radius: 8px;
      padding: 1rem;
      border-left: 4px solid #2196f3;
    }
    
    .info-note p {
      margin: 0;
      color: #1976d2;
      font-size: 0.9rem;
    }
  `]
})
export class BalancesComponent implements OnInit {
  balances: Balance[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private balanceService: BalanceService) {}

  ngOnInit(): void {
    this.loadBalances();
  }

  loadBalances(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.balanceService.getBalances().subscribe({
      next: (balances) => {
        this.balances = balances;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading balances:', error);
        this.errorMessage = 'Failed to load account balances. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
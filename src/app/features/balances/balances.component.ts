import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Balance, BalancePeriod, BalanceService } from '../../shared/services/balance.service';

@Component({
  selector: 'app-balances',
  standalone: true,
  imports: [CommonModule],  template: `
    <div class="balances-container">
      <div class="header">
        <h2>Account Balances</h2>
        <p class="subtitle">View current balances for each account by period</p>
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

        <!-- Balance periods -->
        <div class="balance-periods" *ngIf="!isLoading && !errorMessage && balancePeriods.length > 0">
          <div class="period-section" *ngFor="let period of balancePeriods">
            <h3 class="period-title">
              Balances as of {{ period.monthName }} {{ period.year }}
            </h3>
            
            <div class="balance-table">
              <div class="balance-row header-row">
                <div class="balance-cell header-cell" *ngFor="let balance of period.balances">
                  {{ balance.accountName }}
                </div>
              </div>
              <div class="balance-row data-row">
                <div class="balance-cell data-cell" 
                     *ngFor="let balance of period.balances"
                     [class.negative]="balance.amount < 0">
                  {{ balance.formattedAmount }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty state -->
        <div class="empty-state" *ngIf="!isLoading && !errorMessage && balancePeriods.length === 0">
          <span class="empty-icon">📊</span>
          <h3>No Balance Data</h3>
          <p>No balance data is currently available. Please contact an administrator to upload balance data.</p>
        </div>
        
        <div class="info-note" *ngIf="!isLoading && !errorMessage && balancePeriods.length > 0">
          <p><strong>Note:</strong> Balance data is updated by administrators. If you notice any discrepancies, please contact support.</p>
        </div>
      </div>
    </div>
  `,  styles: [`
    .balances-container {
      max-width: 1200px;
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

    .balance-periods {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .period-section {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 2rem;
      border: 1px solid #e9ecef;
    }

    .period-title {
      color: #333;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 1.5rem 0;
      text-align: center;
      border-bottom: 2px solid #667eea;
      padding-bottom: 0.5rem;
    }

    .balance-table {
      display: flex;
      flex-direction: column;
      border: 2px solid #dee2e6;
      border-radius: 8px;
      overflow: hidden;
      background: white;
    }

    .balance-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      min-height: 60px;
    }

    .balance-cell {
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      border-right: 1px solid #dee2e6;
      word-wrap: break-word;
    }

    .balance-cell:last-child {
      border-right: none;
    }

    .header-row {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
    }

    .header-cell {
      font-size: 1rem;
      font-weight: 600;
    }

    .data-row {
      background: white;
    }

    .data-cell {
      font-size: 1.1rem;
      font-weight: 500;
      color: #28a745;
      border-top: 1px solid #dee2e6;
    }

    .data-cell.negative {
      color: #dc3545;
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
      margin-top: 2rem;
    }
    
    .info-note p {
      margin: 0;
      color: #1976d2;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .balance-row {
        grid-template-columns: 1fr;
      }
      
      .balance-cell {
        border-right: none;
        border-bottom: 1px solid #dee2e6;
      }
      
      .balance-cell:last-child {
        border-bottom: none;
      }
      
      .data-cell {
        border-top: none;
      }
      
      .period-section {
        padding: 1rem;
      }
      
      .balances-container {
        padding: 1rem;
      }
    }
  `]
})
export class BalancesComponent implements OnInit {
  balancePeriods: BalancePeriod[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private balanceService: BalanceService) {}

  ngOnInit(): void {
    this.loadBalances();
  }

  loadBalances(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.balanceService.getBalancePeriods().subscribe({
      next: (balancePeriods) => {
        this.balancePeriods = balancePeriods;
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
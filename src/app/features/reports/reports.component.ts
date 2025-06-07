import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-container">
      <div class="header">
        <h2>Reports & Analytics</h2>
        <p class="subtitle">View reports and analytics (Admin only)</p>
      </div>
      
      <div class="reports-grid">
        <div class="report-card">
          <div class="report-header">
            <h3>📊 Account Summary</h3>
            <span class="report-status active">Live</span>
          </div>
          <div class="report-stats">
            <div class="stat-item">
              <span class="stat-value">{{ totalAccounts }}</span>
              <span class="stat-label">Total Accounts</span>
            </div>
            <div class="stat-item">
              <span class="stat-value positive">{{ positiveBalances }}</span>
              <span class="stat-label">Positive Balances</span>
            </div>
            <div class="stat-item">
              <span class="stat-value negative">{{ negativeBalances }}</span>
              <span class="stat-label">Negative Balances</span>
            </div>
          </div>
        </div>
        
        <div class="report-card">
          <div class="report-header">
            <h3>💰 Total Balance</h3>
            <span class="report-status active">Live</span>
          </div>
          <div class="balance-summary">
            <div class="total-balance" [class.negative]="totalBalance < 0">
              {{ totalBalance | currency }}
            </div>
            <div class="balance-breakdown">
              <div class="breakdown-item">
                <span class="breakdown-label">Assets:</span>
                <span class="breakdown-value positive">{{ totalAssets | currency }}</span>
              </div>
              <div class="breakdown-item">
                <span class="breakdown-label">Liabilities:</span>
                <span class="breakdown-value negative">{{ totalLiabilities | currency }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="report-card">
          <div class="report-header">
            <h3>📈 Monthly Trend</h3>
            <span class="report-status">Updated Daily</span>
          </div>
          <div class="trend-chart">
            <div class="chart-placeholder">
              <span class="chart-icon">📊</span>
              <p>Chart visualization would appear here</p>
              <p class="chart-note">Integration with charting library needed</p>
            </div>
          </div>
        </div>
        
        <div class="report-card">
          <div class="report-header">
            <h3>📋 Recent Activity</h3>
            <span class="report-status">Last 7 days</span>
          </div>
          <div class="activity-list">
            <div class="activity-item" *ngFor="let activity of recentActivity">
              <div class="activity-info">
                <span class="activity-type">{{ activity.type }}</span>
                <span class="activity-description">{{ activity.description }}</span>
                <span class="activity-date">{{ activity.date | date:'short' }}</span>
              </div>
              <span class="activity-status" [class]="activity.status">
                {{ activity.status === 'success' ? '✅' : '⚠️' }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="export-section">
        <h3>Export Reports</h3>
        <div class="export-buttons">
          <button class="btn btn-primary" (click)="exportReport('pdf')">
            📄 Export PDF
          </button>
          <button class="btn btn-secondary" (click)="exportReport('excel')">
            📊 Export Excel
          </button>
          <button class="btn btn-secondary" (click)="exportReport('csv')">
            📝 Export CSV
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .header {
      text-align: center;
      margin-bottom: 3rem;
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
    
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }
    
    .report-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    
    .report-card:hover {
      transform: translateY(-4px);
    }
    
    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f0f0f0;
    }
    
    .report-header h3 {
      margin: 0;
      color: #333;
      font-size: 1.3rem;
    }
    
    .report-status {
      font-size: 0.8rem;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-weight: 600;
      background-color: #e9ecef;
      color: #6c757d;
    }
    
    .report-status.active {
      background-color: #d4edda;
      color: #155724;
    }
    
    .report-stats {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      min-width: 80px;
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #333;
    }
    
    .stat-value.positive {
      color: #28a745;
    }
    
    .stat-value.negative {
      color: #dc3545;
    }
    
    .stat-label {
      font-size: 0.9rem;
      color: #666;
      text-align: center;
      margin-top: 0.5rem;
    }
    
    .balance-summary {
      text-align: center;
    }
    
    .total-balance {
      font-size: 3rem;
      font-weight: bold;
      color: #28a745;
      margin-bottom: 1rem;
    }
    
    .total-balance.negative {
      color: #dc3545;
    }
    
    .balance-breakdown {
      display: flex;
      justify-content: space-around;
      gap: 1rem;
    }
    
    .breakdown-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }
    
    .breakdown-label {
      font-size: 0.9rem;
      color: #666;
    }
    
    .breakdown-value {
      font-weight: bold;
      font-size: 1.1rem;
    }
    
    .breakdown-value.positive {
      color: #28a745;
    }
    
    .breakdown-value.negative {
      color: #dc3545;
    }
    
    .trend-chart {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .chart-placeholder {
      text-align: center;
      color: #666;
    }
    
    .chart-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 1rem;
    }
    
    .chart-note {
      font-size: 0.8rem;
      font-style: italic;
      margin-top: 0.5rem;
    }
    
    .activity-list {
      max-height: 250px;
      overflow-y: auto;
    }
    
    .activity-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .activity-item:last-child {
      border-bottom: none;
    }
    
    .activity-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .activity-type {
      font-weight: 600;
      color: #333;
    }
    
    .activity-description {
      color: #666;
      font-size: 0.9rem;
    }
    
    .activity-date {
      color: #999;
      font-size: 0.8rem;
    }
    
    .activity-status {
      font-size: 1.2rem;
    }
    
    .export-section {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .export-section h3 {
      margin-bottom: 1.5rem;
      color: #333;
    }
    
    .export-buttons {
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
      font-weight: 600;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    
    .btn:hover {
      transform: translateY(-2px);
    }
  `]
})
export class ReportsComponent {
  totalAccounts = 12;
  positiveBalances = 8;
  negativeBalances = 4;
  totalBalance = 25756.38;
  totalAssets = 26741.58;
  totalLiabilities = -985.20;
  
  recentActivity = [
    {
      type: 'Data Upload',
      description: 'Monthly balance data imported',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'success'
    },
    {
      type: 'Report Generated',
      description: 'Quarterly summary report created',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'success'
    },
    {
      type: 'Data Validation',
      description: 'Account reconciliation completed',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'warning'
    },
    {
      type: 'System Update',
      description: 'Balance calculation engine updated',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'success'
    }
  ];

  exportReport(format: string): void {
    // Simulate export process
    alert(`Exporting report in ${format.toUpperCase()} format...`);
    
    // In a real implementation, this would trigger a download
    setTimeout(() => {
      alert(`${format.toUpperCase()} report has been exported successfully!`);
    }, 1500);
  }
}

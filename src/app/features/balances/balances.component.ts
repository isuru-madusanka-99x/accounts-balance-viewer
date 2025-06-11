import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Balance, BalancePeriod, BalanceService } from '../../shared/services/balance.service';

@Component({
  selector: 'app-balances',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balances.component.html',
  styleUrls: ['./balances.component.scss']
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
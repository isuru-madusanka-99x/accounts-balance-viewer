import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { BalancesComponent } from './balances.component';
import { BalanceService, BalancePeriod } from '../../shared/services/balance.service';

describe('BalancesComponent', () => {
  let component: BalancesComponent;
  let fixture: any;
  let balanceService: jasmine.SpyObj<BalanceService>;

  const mockBalancePeriods: BalancePeriod[] = [
    {
      year: 2024,
      month: 1,
      monthName: 'January',
      balances: [
        {
          accountName: 'Test Account',
          accountCode: 'TEST001',
          amount: 1000,
          formattedAmount: '$1,000.00'
        }
      ]
    }
  ];

  beforeEach(async () => {
    const balanceServiceSpy = jasmine.createSpyObj('BalanceService', ['getBalancePeriods']);

    await TestBed.configureTestingModule({
      imports: [BalancesComponent],
      providers: [
        { provide: BalanceService, useValue: balanceServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BalancesComponent);
    component = fixture.componentInstance;
    balanceService = TestBed.inject(BalanceService) as jasmine.SpyObj<BalanceService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load balances on init', () => {
    balanceService.getBalancePeriods.and.returnValue(of(mockBalancePeriods));
    
    component.ngOnInit();
    
    expect(balanceService.getBalancePeriods).toHaveBeenCalled();
    expect(component.balancePeriods).toEqual(mockBalancePeriods);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when loading balances fails', () => {
    const errorMessage = 'Failed to load';
    balanceService.getBalancePeriods.and.returnValue(throwError(() => new Error(errorMessage)));
    
    component.loadBalances();
    
    expect(component.errorMessage).toBe('Failed to load account balances. Please try again.');
    expect(component.isLoading).toBeFalse();
  });

  it('should set loading state correctly', () => {
    balanceService.getBalancePeriods.and.returnValue(of(mockBalancePeriods));
    
    expect(component.isLoading).toBeFalse();
    
    component.loadBalances();
    
    expect(component.isLoading).toBeFalse(); // Should be false after successful load
    expect(component.balancePeriods).toEqual(mockBalancePeriods);
  });

  it('should initialize with empty balance periods', () => {
    expect(component.balancePeriods).toEqual([]);
    expect(component.errorMessage).toBe('');
  });
});

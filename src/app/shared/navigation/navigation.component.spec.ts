import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NavigationComponent } from './navigation.component';
import { AuthService, UserRole } from '../../auth/auth.service';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: any;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      isAuthenticated$: of(true),
      isAdmin$: of(true),
      user$: of({ name: 'Test User', email: 'test@example.com', role: UserRole.USER })
    });

    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with admin observable', () => {
    expect(component.isAdmin$).toBeDefined();
    
    component.isAdmin$.subscribe(isAdmin => {
      expect(isAdmin).toBeTrue();
    });
  });

  it('should call authService.logout when logout is called', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should have access to authService properties', () => {
    expect(component.authService).toBeDefined();
    expect(component.authService.isAuthenticated$).toBeDefined();
    expect(component.authService.user$).toBeDefined();
  });

  it('should initialize on ngOnInit', () => {
    spyOn(component.isAdmin$, 'subscribe');
    
    component.ngOnInit();
    
    expect(component.isAdmin$.subscribe).toHaveBeenCalled();
  });
});

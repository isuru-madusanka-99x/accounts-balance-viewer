import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './shared/navigation/navigation.component';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavigationComponent],
  template: `
    <div class="app">
      <app-navigation></app-navigation>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f8f9fa;
    }
    
    .main-content {
      flex: 1;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'accounts-balance-viewer';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Handle Auth0 callback and redirect unauthenticated users
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (!isAuthenticated && !this.router.url.includes('/login')) {
        this.router.navigate(['/login']);
      }
    });
  }
}

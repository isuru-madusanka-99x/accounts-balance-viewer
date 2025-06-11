import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
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

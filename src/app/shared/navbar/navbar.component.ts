import {Component, DoCheck, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {UserLight} from '../../core/models/user/user';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit, DoCheck {
  currentUser?: UserLight;
  menuOpen: boolean = false;
  profileMenuOpen: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateCurrentUser();
  }

  ngDoCheck(): void {
    this.updateCurrentUser();
  }

  private updateCurrentUser(): void {
    if (this.currentUser !== this.userService.currentUser) {
      this.currentUser = this.userService.currentUser;
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  goToProfile() {
    this.router.navigate(['/user/profile']);
    this.profileMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.profileMenuOpen = false;
    this.router.navigate(['/user/login']);
  }
}



import {Component, OnInit} from '@angular/core';
import {UserLight} from '../../../../core/models/user/user';
import {UserService} from '../../../../services/user/user.service';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomDatePipe} from '../../../../core/utils/DatePipe';

@Component({
  selector: 'app-profile',
  imports: [
    NgIf,
    CustomDatePipe,
    NgForOf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user?: UserLight;
  userFriends: UserLight[] = [];
  loading: boolean = false;
  errorMessage?: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.user = this.userService.currentUser;
    // Rediriger vers la page de connexion si aucun utilisateur n'est connecté
    if (!this.user) {
      this.router.navigate(['/user/login']);
      return;
    }

    this.loadUserFriends();
  }

  async loadUserFriends(): Promise<void> {
    if (!this.user?.id) return;

    try {
      this.loading = true;
      this.userFriends = await this.userService.getUserFriends(this.user.id);
    } catch (error) {
      console.error('Erreur lors du chargement des amis:', error);
      this.errorMessage = 'Impossible de charger la liste des amis';
    } finally {
      this.loading = false;
    }
  }

}



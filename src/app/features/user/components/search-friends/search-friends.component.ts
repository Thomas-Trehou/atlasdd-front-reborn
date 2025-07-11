import {Component, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {UserLight} from '../../../../core/models/user/user';
import {UserService} from '../../../../services/user/user.service';

@Component({
  selector: 'app-search-friends',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-friends.component.html',
})
export class SearchFriendsComponent {
  @Output() invitationSent = new EventEmitter<void>();

  searchTerm: string = '';
  searchResult?: UserLight;
  loading: boolean = false;
  message?: string;
  isError: boolean = false;

  private currentUser: UserLight | undefined;

  constructor(private userService: UserService) {
    this.currentUser = this.userService.currentUser;
  }

  async searchUser(): Promise<void> {
    if (!this.searchTerm.trim()) return;
    this.loading = true;
    this.searchResult = undefined;
    this.message = undefined;

    try {
      console.log('searching for', this.searchTerm);
      console.log('trimmed searchTerm is', this.searchTerm.trim());
      this.searchResult = await this.userService.searchUserBySlug(this.searchTerm.trim());
    } catch (error) {
      this.message = 'Aucun utilisateur trouvé.';
      this.isError = true;
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async sendInvitation(receiverId: number): Promise<void> {
    if (!this.currentUser?.id) {
      this.message = 'Vous devez être connecté pour envoyer une invitation.';
      this.isError = true;
      return;
    }

    try {
      await this.userService.sendFriendInvitation(this.currentUser.id, receiverId);
      this.message = 'Invitation envoyée avec succès !';
      this.isError = false;
      this.searchResult = undefined; // Cacher le résultat après envoi
      this.invitationSent.emit();
    } catch (error) {
      this.message = "Erreur lors de l'envoi de l'invitation.";
      this.isError = true;
      console.error(error);
    }
  }
}

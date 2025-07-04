import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Invitation} from '../../../../core/models/user/invitation';
import {UserLight} from '../../../../core/models/user/user';
import {UserService} from '../../../../services/user/user.service';

@Component({
  selector: 'app-manage-invitations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-invitations.component.html',
})
export class ManageInvitationsComponent implements OnInit {
  @Output() friendAdded = new EventEmitter<void>();

  receivedInvitations: Invitation[] = [];
  sentInvitations: Invitation[] = [];
  loading = false;
  private currentUser: UserLight | undefined;

  constructor(private userService: UserService) {
    this.currentUser = this.userService.currentUser;
  }

  ngOnInit(): void {
    this.loadInvitations();
  }

  async loadInvitations(): Promise<void> {
    if (!this.currentUser) return;
    this.loading = true;
    try {
      const allPending = await this.userService.getPendingInvitations(this.currentUser?.id);
      // Filtrer les invitations reçues et envoyées
      this.receivedInvitations = allPending.filter(inv => inv.receiver_user_id === this.currentUser?.id);
      this.sentInvitations = allPending.filter(inv => inv.requester_user_id === this.currentUser?.id);
    } catch (error) {
      console.error("Erreur lors du chargement des invitations", error);
    } finally {
      this.loading = false;
    }
  }

  async accept(invitationId: number): Promise<void> {
    if (!this.currentUser?.id) return;
    try {
      // 1. Appel API pour accepter
      await this.userService.acceptInvitation(invitationId, this.currentUser.id);

      // 2. Mise à jour immédiate de la liste d'invitations (la supprime de la vue)
      this.receivedInvitations = this.receivedInvitations.filter(inv => inv.id !== invitationId);

      // 3. Émettre l'événement pour notifier le parent
      this.friendAdded.emit();

    } catch (error) {
      console.error("Erreur lors de l'acceptation de l'invitation", error);
      // Afficher une notification d'erreur à l'utilisateur serait une bonne pratique
    }
  }

  async decline(invitationId: number): Promise<void> {
    if (!this.currentUser?.id) return;
    try {
      await this.userService.declineInvitation(invitationId, this.currentUser.id);
      // Mise à jour immédiate également pour le refus
      this.receivedInvitations = this.receivedInvitations.filter(inv => inv.id !== invitationId);
    } catch (error) {
      console.error("Erreur lors du refus de l'invitation", error);
    }
  }

  async cancel(invitationId: number): Promise<void> {
    if (!this.currentUser?.id) return;
    try {
      await this.userService.cancelInvitation(invitationId, this.currentUser.id);
      // Mise à jour immédiate pour l'annulation
      this.sentInvitations = this.sentInvitations.filter(inv => inv.id !== invitationId);
    } catch (error) {
      console.error("Erreur lors de l'annulation de l'invitation", error);
    }
  }
}

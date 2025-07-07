export enum InvitationStatus {
  PENDING = 'PENDING'
}

export interface Invitation {
  id: number;
  status: InvitationStatus.PENDING;
  receiver_user_id: number;
  receiver_user_pseudo: string;
  requester_user_id: number;
  requester_user_pseudo: string;
  createdAt: string;
}

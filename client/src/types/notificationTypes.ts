export type NotificationType =
  | 'proposal-received'
  | 'proposal-accepted'
  | 'proposal-rejected'
  | 'job-invitation'
  | 'job-invitation-accepted'
  | 'job-invitation-rejected'
  | 'job-submitted'
  | 'message'
  | 'payment-success'
  | 'payment-released'
  | 'review-received'
  | 'admin-alert';

export interface INotification {
  _id: string;               
  senderId: string;
  recipientId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
}
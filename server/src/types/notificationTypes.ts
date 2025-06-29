export const NotificationTypes = {
  PROPOSAL_SUBMITTED: 'proposal-received',
  PROPOSAL_ACCEPTED: 'proposal-accepted',
  PROPOSAL_REJECTED: 'proposal-rejected',
  JOB_INVITATION: 'job-invitation',
  JOB_INVITATION_ACCEPTED: 'job-invitation-accepted',
  JOB_INVITATION_REJECTED: 'job-invitation-rejected',
  JOB_SUBMITTED: 'job-submitted',
  MESSAGE: 'message',
  PAYMENT_SUCCESS: 'payment-success',
  PAYMENT_RELEASED: 'payment-released',
  REVIEW_RECEIVED: 'review-received',
  ADMIN_ALERT: 'admin-alert',
} as const;

export type NotificationType = typeof NotificationTypes[keyof typeof NotificationTypes];

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  DutyRoster?: DutyRoster[];
  assignment?: Assignment[];
  notifications?: Notification[];
  assigned?: Assignment[];
}

export interface DutyRoster {
  id: string;
  date: string;
  shift: Shift;
  addedById: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
  assignment?: Assignment[];
}

export interface Assignment {
  id: string;
  dutyRosterId: string;
  userId: string;
  assignedById: string;
  createdAt: string;
  updatedAt: string;
  dutyRoster?: DutyRoster;
  user?: User;
  assignedBy?: User;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  metadata?: string;
  type: NotificationType;
  title: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export const enum Role {
  ADMIN,
  STAFF,
  SUPERVISOR,
}

export enum Shift {
  MORNING,
  EVENING,
  NIGHT,
}

export enum NotificationType {
  ASSIGNMENT_CREATED,
  ASSIGNMENT_UPDATED,
  ASSIGNMENT_DELETED,
  DUTY_ROSTER_CREATED,
  DUTY_ROSTER_UPDATED,
  SYSTEM_ANNOUNCEMENT,
  REMINDER,
}

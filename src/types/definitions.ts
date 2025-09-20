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
  assignedBy?: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
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
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  SUPERVISOR = "SUPERVISOR",
}

export enum Shift {
  MORNING = "MORNING",
  EVENING = "EVENING",
  NIGHT = "NIGHT",
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

// Calendar-specific types for react-big-calendar
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: Assignment;
  allDay?: boolean;
}

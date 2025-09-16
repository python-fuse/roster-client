import api from "../api/axios";

import type {
  User,
  Assignment,
  DutyRoster,
  Notification,
  Shift,
} from "@/types/definitions";

export class APIService {
  // Auth APIs
  static login = (email: string, password: string) => {
    return api.post<{ message: string; user: User }>("/auth/login", {
      email,
      password,
    });
  };

  static register = (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    return api.post<User>("/auth/register", userData);
  };

  static logout = () => {
    return api.post("/auth/logout");
  };

  static getCurrentUser = () => {
    return api.get<User>("/auth/me");
  };

  // Users APIs
  static getUsers = () => {
    return api.get<User[]>("/users");
  };

  static getUserById = (id: string) => {
    return api.get<User>(`/users/${id}`);
  };

  static updateUser = (
    id: string,
    userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ) => {
    return api.put<User>(`/users/${id}`, userData);
  };

  static deleteUser = (id: string) => {
    return api.delete(`/users/${id}`);
  };

  // Assignment APIs
  static getAssignments = () => {
    return api.get<Assignment[]>("/assignments");
  };

  static createAssignment = (
    assignmentData: Omit<Assignment, "id" | "createdAt" | "updatedAt">
  ) => {
    return api.post<Assignment>("/assignments", assignmentData);
  };

  static updateAssignment = (
    id: number,
    assignmentData: Partial<Omit<Assignment, "id" | "createdAt" | "updatedAt">>
  ) => {
    return api.put<Assignment>(`/assignments/${id}`, assignmentData);
  };

  static deleteAssignment = (id: number) => {
    return api.delete(`/assignments/${id}`);
  };

  // Duty Roster APIs
  static getDutyRosters = () => {
    return api.get<DutyRoster[]>("/dutyrosters");
  };

  static getUserDutyRosters = (userId: string) => {
    return api.get<DutyRoster[]>(`/dutyrosters/user/${userId}`);
  };

  static createDutyRoster = (createdById: string, date: Date, shift: Shift) => {
    return api.post<DutyRoster>("/dutyrosters", { createdById, date, shift });
  };

  static updateDutyRoster = (
    id: string,
    dutyRosterData: Partial<Omit<DutyRoster, "id" | "createdAt" | "updatedAt">>
  ) => {
    return api.put<DutyRoster>(`/dutyrosters/${id}`, dutyRosterData);
  };

  static deleteDutyRoster = (id: string) => {
    return api.delete(`/dutyrosters/${id}`);
  };

  // Notification APIs
  static getNotifications = () => {
    return api.get<Notification[]>("/notifications");
  };

  static getUserNotifications = (userId: string) => {
    return api.get<Notification[]>(`/notifications/user/${userId}`);
  };

  static markNotificationAsRead = (id: string) => {
    return api.put<Notification>(`/notifications/read/${id}`);
  };
}

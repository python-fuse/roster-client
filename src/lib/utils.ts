import { Shift } from "@/types/definitions";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getShiftName = (shift: Shift): string => {
  switch (shift) {
    case Shift.MORNING:
      return "Morning";
    case Shift.EVENING:
      return "Evening";
    case Shift.NIGHT:
      return "Night";
    default:
      return "Unknown";
  }
};

export const getShiftColor = (shift: Shift): string => {
  switch (shift) {
    case Shift.MORNING:
      return "#10B981"; // green
    case Shift.EVENING:
      return "#F59E0B"; // amber
    case Shift.NIGHT:
      return "#6366F1"; // indigo
    default:
      return "#6B7280"; // gray
  }
};

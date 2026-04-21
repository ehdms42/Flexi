export type CategoryType = "work" | "personal";
export type Priority = "red" | "orange" | "yellow" | "green";

export interface NewScheduleForm {
  title: string;
  location: string;
  priority: number;
  category: CategoryType;
  startDate: Date;
  endDate: Date;
  memo: string;
}

export type DatePickerMode = "startDate" | "startTime" | "endDate" | "endTime" | null;

export interface Schedule {
  id: string;
  title: string;
  category: string;
  categoryType: CategoryType;
  startTime: string;
  endTime: string;
  hour: number;
  priority: Priority;
}

export interface WeekDay {
  isoDate: string;
  date: number;
  day: string;
}

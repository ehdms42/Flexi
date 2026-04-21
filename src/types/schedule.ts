export type CategoryType = "work" | "personal";
export type Priority = "red" | "orange" | "yellow" | "green";
// 0=green(보류) 1=yellow(보통) 2=orange(높음) 3=red(최우선)
export type PriorityIndex = 0 | 1 | 2 | 3;

export interface NewScheduleForm {
  title: string;
  location: string;
  priority: PriorityIndex;
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
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  priority: Priority;
}

export interface WeekDay {
  isoDate: string;
  date: number;
  day: string;
}

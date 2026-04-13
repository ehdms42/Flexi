export type CategoryType = "work" | "personal";
export type Priority = "red" | "orange" | "yellow" | "green";

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
  date: number;
  day: string;
}

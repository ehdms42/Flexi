import { Schedule, WeekDay } from "@/types/schedule";

export const MOCK_WEEK_DATES: WeekDay[] = [
  { date: 14, day: "월" },
  { date: 15, day: "화" },
  { date: 16, day: "수" },
  { date: 17, day: "목" },
  { date: 18, day: "금" },
  { date: 19, day: "토" },
  { date: 20, day: "일" },
];

export const MOCK_SCHEDULES: Schedule[] = [
  {
    id: "1",
    title: "팀 회의",
    category: "회사",
    categoryType: "work",
    startTime: "10:00",
    endTime: "11:00",
    hour: 10,
    priority: "red",
  },
];

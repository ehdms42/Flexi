export const formatDate = (date: Date): string =>
  `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;

export const formatTime = (date: Date): string =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

// "HH:mm" 문자열에서 시(hour) 값을 파생 — Schedule.hour 중복 필드 제거에 따른 헬퍼
export const hourFromTime = (time: string): number => parseInt(time.split(":")[0], 10);

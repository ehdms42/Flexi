export const formatDate = (date: Date): string =>
  `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;

export const formatTime = (date: Date): string =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

// "HH:mm" 문자열에서 시(hour) 값을 파생 — Schedule.hour 중복 필드 제거에 따른 헬퍼
export const hourFromTime = (time: string): number => {
  if (!time || !/^\d{1,2}:\d{2}$/.test(time)) {
    throw new Error(`Invalid time format: "${time}". Expected "HH:mm" or "H:mm" format.`);
  }
  const hour = parseInt(time.split(":")[0], 10);
  if (isNaN(hour) || hour < 0 || hour > 23) {
    throw new Error(`Invalid hour value in time: "${time}". Hour must be between 0 and 23.`);
  }
  return hour;
};
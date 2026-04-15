export const formatDate = (date: Date): string =>
  `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;

export const formatTime = (date: Date): string =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

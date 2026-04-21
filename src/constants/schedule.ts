import StarGreen from "@assets/icons/star-green.svg";
import StarYellow from "@assets/icons/star-yellow.svg";
import StarOrange from "@assets/icons/star-orange.svg";
import StarRed from "@assets/icons/star-red.svg";
import CategoryWork from "@assets/icons/category-work.svg";
import CategoryPersonal from "@assets/icons/category-personal.svg";
import type { ComponentType } from "react";
import { Dimensions } from "react-native";
import type { CategoryType, Priority } from "@/types/schedule";

// Priority Slider
export const PRIORITY_LEVELS = [0, 1 / 3, 2 / 3, 1] as const;

export const PRIORITY_ICON_MAP: Record<Priority, ComponentType<{ width?: number; height?: number }>> = {
  green: StarGreen,
  yellow: StarYellow,
  orange: StarOrange,
  red: StarRed,
};

// Derived array for index-based access: HOLD(0)→green … HIGHEST(3)→red
export const PRIORITY_ICONS = [
  PRIORITY_ICON_MAP.green,
  PRIORITY_ICON_MAP.yellow,
  PRIORITY_ICON_MAP.orange,
  PRIORITY_ICON_MAP.red,
];

export const CATEGORY_ICON_MAP: Record<CategoryType, ComponentType<{ width?: number; height?: number }>> = {
  work: CategoryWork,
  personal: CategoryPersonal,
};
export const THUMB_SIZE = 24;
export const DOT_SIZE = 8;

// Custom Date Picker
const SCREEN_WIDTH = Dimensions.get("window").width;
export const CARD_MARGIN = 20;
export const CARD_PADDING_H = 24;
export const CARD_PADDING_V = 28;
export const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;
export const INNER_WIDTH = CARD_WIDTH - CARD_PADDING_H * 2;
export const CELL_SIZE = Math.floor(INNER_WIDTH / 7);
export const CIRCLE_SIZE = Math.min(CELL_SIZE, 44);
export const WEEK_DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;

// Custom Time Picker — 너비는 화면 폭에서 파생, 높이는 5의 배수로 고정(스냅 오차 방지)
const TP_CARD_MARGIN = 11;
export const TP_CARD_W = SCREEN_WIDTH - TP_CARD_MARGIN * 2;
export const TP_CARD_H = 200;
export const ITEM_HEIGHT = TP_CARD_H / 5; // 200 / 5 = 40, 정수 보장
export const HOURS = Array.from({ length: 24 }, (_, i) => i);
export const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

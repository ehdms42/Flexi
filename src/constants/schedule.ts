import StarGreen from "@assets/icons/star-green.svg";
import StarYellow from "@assets/icons/star-yellow.svg";
import StarOrange from "@assets/icons/star-orange.svg";
import StarRed from "@assets/icons/star-red.svg";
import { Dimensions } from "react-native";

// Priority Slider
export const PRIORITY_LEVELS = [0, 1 / 3, 2 / 3, 1] as const;
export const PRIORITY_ICONS = [StarGreen, StarYellow, StarOrange, StarRed];
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

// Custom Time Picker
export const TP_CARD_W = 353;
export const TP_CARD_H = 204;
export const ITEM_HEIGHT = Math.floor(TP_CARD_H / 5);
export const HOURS = Array.from({ length: 24 }, (_, i) => i);
export const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

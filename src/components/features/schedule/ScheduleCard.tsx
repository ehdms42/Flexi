import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { colors } from "@constants/colors";
import { fontFamily } from "@constants/typography";
import StarRed from "@assets/icons/star-red.svg";
import StarOrange from "@assets/icons/star-orange.svg";
import StarYellow from "@assets/icons/star-yellow.svg";
import StarGreen from "@assets/icons/star-green.svg";
import CategoryWork from "@assets/icons/category-work.svg";
import CategoryPersonal from "@assets/icons/category-personal.svg";

interface ScheduleCardProps {
  title: string;
  category: string;
  categoryType: "work" | "personal";
  startTime: string;
  endTime: string;
  priority: "red" | "orange" | "yellow" | "green";
  onPress?: () => void;
}

const PRIORITY_ICONS = {
  red: <StarRed width={12} height={12} />,
  orange: <StarOrange width={12} height={12} />,
  yellow: <StarYellow width={12} height={12} />,
  green: <StarGreen width={12} height={12} />,
};

const CATEGORY_ICONS = {
  work: <CategoryWork width={36} height={36} />,
  personal: <CategoryPersonal width={36} height={36} />,
};

export default function ScheduleCard({
  title,
  category,
  categoryType,
  startTime,
  endTime,
  priority,
  onPress,
}: ScheduleCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.left}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.category}>{category}</Text>
        </View>
        <View style={styles.timeRow}>
          {PRIORITY_ICONS[priority]}
          <Text style={styles.time}>
            {startTime} - {endTime}
          </Text>
        </View>
      </View>
      <View style={styles.categoryIcon}>{CATEGORY_ICONS[categoryType]}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.gray[100],
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    padding: 20,
    marginLeft: 95,
    marginTop: 2,
    marginBottom: 2,
    height: 130,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  left: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    height: 23,
  },
  title: {
    fontFamily: fontFamily.pretendard.bold,
    fontSize: 16,
    color: colors.primary.black,
  },
  category: {
    fontFamily: fontFamily.pretendard.semiBold,
    fontSize: 12,
    lineHeight: 12,
    color: colors.gray[50],
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  time: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 12,
    color: colors.gray[50],
  },
  categoryIcon: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});

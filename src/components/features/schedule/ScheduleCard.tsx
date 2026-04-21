import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { colors } from "@constants/colors";
import { typography } from "@constants/typography";
import { PRIORITY_ICON_MAP, CATEGORY_ICON_MAP } from "@constants/schedule";
import { CategoryType, Priority } from "@/types/schedule";

interface ScheduleCardProps {
  title: string;
  category: string;
  categoryType: CategoryType;
  startTime: string;
  endTime: string;
  priority: Priority;
  onPress?: () => void;
}

export default function ScheduleCard({
  title,
  category,
  categoryType,
  startTime,
  endTime,
  priority,
  onPress,
}: ScheduleCardProps) {
  const PriorityIcon = PRIORITY_ICON_MAP[priority];
  const CategoryIcon = CATEGORY_ICON_MAP[categoryType];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.left}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.category}>{category}</Text>
        </View>
        <View style={styles.timeRow}>
          <PriorityIcon width={12} height={12} />
          <Text style={styles.time}>
            {startTime} - {endTime}
          </Text>
        </View>
      </View>
      <View style={styles.categoryIcon}>
        <CategoryIcon width={36} height={36} />
      </View>
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
    ...typography.body3,
    color: colors.primary.black,
  },
  category: {
    ...typography.label1,
    lineHeight: 12,
    color: colors.gray[50],
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  time: {
    ...typography.label2,
    color: colors.gray[50],
  },
  categoryIcon: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});

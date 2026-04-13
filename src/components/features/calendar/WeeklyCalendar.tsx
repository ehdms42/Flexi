import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { colors } from "@constants/colors";
import { fontFamily, typography } from "@constants/typography";
import { WeekDay } from "@/types/schedule";

interface WeeklyCalendarProps {
  selectedDate: number;
  onSelectDate: (date: number) => void;
  weekDates: WeekDay[];
}

export default function WeeklyCalendar({
  selectedDate,
  onSelectDate,
  weekDates,
}: WeeklyCalendarProps) {
  return (
    <View style={styles.container}>
      {weekDates.map((item) => {
        const isSelected = item.date === selectedDate;
        return (
          <TouchableOpacity
            key={item.date}
            style={[styles.dateItem, isSelected && styles.dateItemSelected]}
            onPress={() => onSelectDate(item.date)}
          >
            <Text
              style={[
                styles.dateNumber,
                isSelected && styles.dateNumberSelected,
              ]}
            >
              {item.date}
            </Text>
            <Text
              style={[styles.dayText, isSelected && styles.dayTextSelected]}
            >
              {item.day}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  dateItem: {
    width: 44,
    height: 62,
    borderRadius: 5,
    paddingTop: 11,
    paddingBottom: 11,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.semantic.backgroundStrong,
  },
  dateItemSelected: {
    backgroundColor: colors.primary.black,
  },
  dateNumber: {
    fontFamily: fontFamily.urbanist.semiBold,
    fontSize: 20,
    lineHeight: 26,
    color: colors.gray[40],
    textAlign: "center",
  },
  dateNumberSelected: {
    color: colors.gray[100],
  },
  dayText: {
    ...typography.label1,
    lineHeight: 12,
    color: colors.gray[60],
    textAlign: "center",
  },
  dayTextSelected: {
    color: colors.gray[100],
  },
});

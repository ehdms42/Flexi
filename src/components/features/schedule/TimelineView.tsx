import { View, Text, StyleSheet } from "react-native";

import { colors } from "@constants/colors";
import { fontFamily } from "@constants/typography";
import ScheduleCard from "./ScheduleCard";

const HOURS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];

interface Schedule {
  id: string;
  title: string;
  category: string;
  categoryType: "work" | "personal";
  startTime: string;
  endTime: string;
  hour: number;
  priority: "red" | "orange" | "yellow" | "green";
}

interface TimelineViewProps {
  schedules: Schedule[];
}

export default function TimelineView({ schedules }: TimelineViewProps) {
  return (
    <View style={styles.container}>
      {HOURS.map((hour, index) => {
        const hourSchedules = schedules.filter((s) => s.hour === index + 9);
        return (
          <View key={hour} style={styles.row}>
            <View style={styles.hourRow}>
              <Text style={styles.hourText}>{hour}</Text>
              <View style={styles.line} />
            </View>
            {hourSchedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                title={schedule.title}
                category={schedule.category}
                categoryType={schedule.categoryType}
                startTime={schedule.startTime}
                endTime={schedule.endTime}
                priority={schedule.priority}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 48,
    paddingBottom: 100,
  },
  row: {
    minHeight: 148,
    marginBottom: 0,
  },
  hourRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    gap: 15,
    marginBottom: 0,
  },
  hourText: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 12,
    lineHeight: 12,
    color: colors.semantic.timelineLabel,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[80],
  },
});

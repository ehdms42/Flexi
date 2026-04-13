import { View, Text, StyleSheet } from "react-native";

import { colors } from "@constants/colors";
import { fontFamily } from "@constants/typography";
import { Schedule } from "@/types/schedule";
import ScheduleCard from "./ScheduleCard";

const TIMELINE_START_HOUR = 9;
const TIMELINE_END_HOUR = 12;

const HOURS = Array.from(
  { length: TIMELINE_END_HOUR - TIMELINE_START_HOUR + 1 },
  (_, i) => {
    const h = TIMELINE_START_HOUR + i;
    const period = h < 12 ? "AM" : "PM";
    const display = h > 12 ? h - 12 : h;
    return { label: `${display}:00 ${period}`, hour: h };
  }
);

interface TimelineViewProps {
  schedules: Schedule[];
}

export default function TimelineView({ schedules }: TimelineViewProps) {
  return (
    <View style={styles.container}>
      {HOURS.map(({ label, hour }) => {
        const hourSchedules = schedules.filter((s) => s.hour === hour);
        return (
          <View key={label} style={styles.row}>
            <View style={styles.hourRow}>
              <Text style={styles.hourText}>{label}</Text>
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

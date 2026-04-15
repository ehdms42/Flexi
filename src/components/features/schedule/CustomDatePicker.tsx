import { useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";

import { colors } from "@constants/colors";
import { fontFamily } from "@constants/typography";
import {
  CARD_PADDING_H,
  CARD_PADDING_V,
  CARD_WIDTH,
  CELL_SIZE,
  CIRCLE_SIZE,
  INNER_WIDTH,
  WEEK_DAYS,
} from "@constants/schedule";
import CalenderLeftArrow from "@assets/icons/calender-left-arrow.svg";

interface CustomDatePickerProps {
  visible: boolean;
  value: Date;
  onConfirm: (date: Date) => void;
  onDismiss: () => void;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CustomDatePicker({
  visible,
  value,
  onConfirm,
  onDismiss,
}: CustomDatePickerProps) {
  const [viewYear, setViewYear] = useState(value.getFullYear());
  const [viewMonth, setViewMonth] = useState(value.getMonth());
  const [selected, setSelected] = useState<Date>(value);

  const goToPrevMonth = useCallback(
    () =>
      setViewMonth((m) => {
        if (m === 0) {
          setViewYear((y) => y - 1);
          return 11;
        }
        return m - 1;
      }),
    []
  );

  const goToNextMonth = useCallback(
    () =>
      setViewMonth((m) => {
        if (m === 11) {
          setViewYear((y) => y + 1);
          return 0;
        }
        return m + 1;
      }),
    []
  );

  const cells: (number | null)[] = [
    ...Array(getFirstDayOfWeek(viewYear, viewMonth)).fill(null),
    ...Array.from({ length: getDaysInMonth(viewYear, viewMonth) }, (_, i) => i + 1),
  ];

  const handleDayPress = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    setSelected(d);
    onConfirm(d);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onDismiss}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.monthTitle}>
                {viewYear}년 {viewMonth + 1}월
              </Text>
              <View style={styles.arrows}>
                <TouchableOpacity
                  onPress={goToPrevMonth}
                  hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                >
                  <CalenderLeftArrow width={9} height={16} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={goToNextMonth}
                  hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                >
                  <CalenderLeftArrow
                    width={9}
                    height={16}
                    style={{ transform: [{ scaleX: -1 }] }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.weekRow}>
              {WEEK_DAYS.map((d) => (
                <View key={d} style={styles.cell}>
                  <Text style={styles.weekLabel}>{d}</Text>
                </View>
              ))}
            </View>

            <View style={styles.grid}>
              {cells.map((day, idx) => {
                if (day === null) return <View key={`p${idx}`} style={styles.cell} />;
                const isSelected = isSameDay(new Date(viewYear, viewMonth, day), selected);
                return (
                  <TouchableOpacity
                    key={day}
                    style={styles.cell}
                    onPress={() => handleDayPress(day)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.dayCircle, isSelected && styles.dayCircleSelected]}>
                      <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                        {day}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.semantic.dimBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: CARD_PADDING_H,
    paddingVertical: CARD_PADDING_V,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  header: {
    width: CELL_SIZE * 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  monthTitle: {
    fontFamily: fontFamily.pretendard.bold,
    fontSize: 18,
    lineHeight: 18 * 1.44,
    color: colors.primary.black,
  },
  arrows: { flexDirection: "row", gap: 18, alignItems: "center" },
  weekRow: { flexDirection: "row", width: INNER_WIDTH, marginBottom: 2 },
  grid: { flexDirection: "row", flexWrap: "wrap", width: INNER_WIDTH },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  weekLabel: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 16,
    lineHeight: 16 * 1.44,
    color: colors.gray[20],
    textAlign: "center",
  },
  dayCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleSelected: { backgroundColor: colors.primary.default },
  dayText: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 16,
    lineHeight: 16 * 1.44,
    color: colors.gray[40],
    textAlign: "center",
  },
  dayTextSelected: {
    color: "#FFFFFF",
    fontFamily: fontFamily.pretendard.bold,
  },
});

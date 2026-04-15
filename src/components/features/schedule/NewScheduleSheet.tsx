import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
} from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { colors } from "@constants/colors";
import { fontFamily, typography } from "@constants/typography";
import ArrowLeft from "@assets/icons/arrow-left.svg";
import CalenderLeftArrow from "@assets/icons/calender-left-arrow.svg";
import CategoryWork from "@assets/icons/category-work.svg";
import CategoryPersonal from "@assets/icons/category-personal.svg";
import StarGreen from "@assets/icons/star-green.svg";
import StarYellow from "@assets/icons/star-yellow.svg";
import StarOrange from "@assets/icons/star-orange.svg";
import StarRed from "@assets/icons/star-red.svg";
import InfoIcon from "@assets/icons/info.svg";

const PRIORITY_LEVELS = [0, 1 / 3, 2 / 3, 1] as const;
const THUMB_SIZE = 24;
const DOT_SIZE = 8;
const PRIORITY_ICONS = [StarGreen, StarYellow, StarOrange, StarRed];

function PrioritySlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const trackWidth = useSharedValue(0);
  const thumbOffset = useSharedValue(value);
  const startOffset = useSharedValue(value);
  const [activeIndex, setActiveIndex] = useState(2);
  const [containerWidth, setContainerWidth] = useState(0);

  const DOT_POSITIONS =
    containerWidth > 0
      ? PRIORITY_LEVELS.map(
          (level) =>
            level * (containerWidth - THUMB_SIZE) +
            THUMB_SIZE / 2 -
            DOT_SIZE / 2
        )
      : [];

  const pan = Gesture.Pan()
    .activeOffsetX([-5, 5])
    .failOffsetY([-10, 10])
    .onBegin(() => {
      startOffset.value = thumbOffset.value;
    })
    .onUpdate((e) => {
      thumbOffset.value = Math.min(
        1,
        Math.max(0, startOffset.value + e.translationX / trackWidth.value)
      );
      runOnJS(onChange)(thumbOffset.value);
    })
    .onEnd(() => {
      const nearest = PRIORITY_LEVELS.reduce((prev, curr) =>
        Math.abs(curr - thumbOffset.value) < Math.abs(prev - thumbOffset.value)
          ? curr
          : prev
      );
      const idx = PRIORITY_LEVELS.indexOf(nearest);
      thumbOffset.value = withSpring(nearest, { damping: 20, stiffness: 300 });
      runOnJS(setActiveIndex)(idx);
      runOnJS(onChange)(nearest);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: thumbOffset.value * (trackWidth.value - THUMB_SIZE) },
    ],
  }));

  const ActiveIcon = PRIORITY_ICONS[activeIndex];

  return (
    <View style={sliderStyles.container}>
      <Text style={sliderStyles.sideLabel}>보류</Text>
      <GestureDetector gesture={pan}>
        <View
          style={sliderStyles.trackContainer}
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            trackWidth.value = w;
            thumbOffset.value = value;
            setContainerWidth(w);
          }}
        >
          <View style={sliderStyles.track} />
          {DOT_POSITIONS.map((left, i) => (
            <View key={i} style={[sliderStyles.dot, { left }]} />
          ))}
          <Animated.View style={[sliderStyles.thumb, thumbStyle]}>
            <ActiveIcon width={THUMB_SIZE} height={THUMB_SIZE} />
          </Animated.View>
        </View>
      </GestureDetector>
      <Text style={sliderStyles.sideLabel}>최우선</Text>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  sideLabel: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 12,
    lineHeight: 12,
    color: colors.semantic.sliderLabel,
  },
  trackContainer: { flex: 1, height: THUMB_SIZE, justifyContent: "center" },
  track: {
    marginHorizontal: THUMB_SIZE / 2,
    height: 2,
    backgroundColor: colors.gray[70],
    borderRadius: 1,
  },
  dot: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.gray[70],
    top: (THUMB_SIZE - DOT_SIZE) / 2,
  },
  thumb: { position: "absolute", width: THUMB_SIZE, height: THUMB_SIZE },
});

// Custom Date Picker
const WEEK_DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;
const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_MARGIN = 20;
const CARD_PADDING_H = 24;
const CARD_PADDING_V = 28;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;
const INNER_WIDTH = CARD_WIDTH - CARD_PADDING_H * 2;
const CELL_SIZE = Math.floor(INNER_WIDTH / 7);
const CIRCLE_SIZE = Math.min(CELL_SIZE, 44);

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

function CustomDatePicker({
  visible,
  value,
  onConfirm,
  onDismiss,
}: {
  visible: boolean;
  value: Date;
  onConfirm: (d: Date) => void;
  onDismiss: () => void;
}) {
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
    ...Array.from(
      { length: getDaysInMonth(viewYear, viewMonth) },
      (_, i) => i + 1
    ),
  ];

  const handleDayPress = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    setSelected(d);
    onConfirm(d);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableOpacity
        style={dp.overlay}
        activeOpacity={1}
        onPress={onDismiss}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={dp.card}>
            <View style={dp.header}>
              <Text style={dp.monthTitle}>
                {viewYear}년 {viewMonth + 1}월
              </Text>
              <View style={dp.arrows}>
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
            <View style={dp.weekRow}>
              {WEEK_DAYS.map((d) => (
                <View key={d} style={dp.cell}>
                  <Text style={dp.weekLabel}>{d}</Text>
                </View>
              ))}
            </View>
            <View style={dp.grid}>
              {cells.map((day, idx) => {
                if (day === null)
                  return <View key={`p${idx}`} style={dp.cell} />;
                const isSelected = isSameDay(
                  new Date(viewYear, viewMonth, day),
                  selected
                );
                return (
                  <TouchableOpacity
                    key={day}
                    style={dp.cell}
                    onPress={() => handleDayPress(day)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[dp.dayCircle, isSelected && dp.dayCircleSelected]}
                    >
                      <Text
                        style={[dp.dayText, isSelected && dp.dayTextSelected]}
                      >
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

const dp = StyleSheet.create({
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
  dayTextSelected: { color: "#FFFFFF", fontFamily: fontFamily.pretendard.bold },
});

// Custom Time Picker
const TP_CARD_W = 353;
const TP_CARD_H = 204;
const ITEM_HEIGHT = Math.floor(TP_CARD_H / 5);
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function DrumColumn({
  items,
  selectedIndex,
  onSelect,
  format,
}: {
  items: number[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  format: (n: number) => string;
}) {
  const scrollRef = useRef<ScrollView>(null);

  React.useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }, 80);
  }, []);

  const handleMomentumEnd = (e: any) => {
    const idx = Math.max(
      0,
      Math.min(
        items.length - 1,
        Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT)
      )
    );
    onSelect(idx);
    scrollRef.current?.scrollTo({ y: idx * ITEM_HEIGHT, animated: true });
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={{ height: TP_CARD_H, flex: 1 }}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      onMomentumScrollEnd={handleMomentumEnd}
      contentContainerStyle={{ paddingVertical: (TP_CARD_H - ITEM_HEIGHT) / 2 }}
    >
      {items.map((val, idx) => {
        const isSelected = idx === selectedIndex;
        const distance = Math.abs(idx - selectedIndex);
        const opacity = distance === 0 ? 1 : distance === 1 ? 0.45 : 0.2;
        return (
          <TouchableOpacity
            key={val}
            style={[tp.drumItem, { opacity }]}
            activeOpacity={0.7}
            onPress={() => {
              onSelect(idx);
              scrollRef.current?.scrollTo({
                y: idx * ITEM_HEIGHT,
                animated: true,
              });
            }}
          >
            <Text style={[tp.drumText, isSelected && tp.drumTextSelected]}>
              {format(val)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function CustomTimePicker({
  visible,
  value,
  onConfirm,
  onDismiss,
}: {
  visible: boolean;
  value: Date;
  onConfirm: (h: number, m: number) => void;
  onDismiss: () => void;
}) {
  const [hourIdx, setHourIdx] = useState(value.getHours());
  const [minuteIdx, setMinuteIdx] = useState(
    Math.round(value.getMinutes() / 5)
  );

  // 두 컬럼 모두 스크롤 완료 후 바로 confirm
  const pendingHour = useRef(value.getHours());
  const pendingMinute = useRef(Math.round(value.getMinutes() / 5) * 5);

  const handleSelectHour = (idx: number) => {
    setHourIdx(idx);
    pendingHour.current = HOURS[idx];
  };
  const handleSelectMinute = (idx: number) => {
    setMinuteIdx(idx);
    pendingMinute.current = MINUTES[idx];
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableOpacity
        style={tp.overlay}
        activeOpacity={1}
        onPress={() => {
          onConfirm(pendingHour.current, pendingMinute.current);
        }}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={tp.card}>
            {/* 가운데 하이라이트 — 카드 전체 너비 */}
            <View style={tp.highlight} pointerEvents="none" />

            {/* 드럼 컬럼 */}
            <View style={tp.columns}>
              <DrumColumn
                items={HOURS}
                selectedIndex={hourIdx}
                onSelect={handleSelectHour}
                format={(n) => String(n).padStart(2, "0")}
              />
              <Text style={tp.colon}>:</Text>
              <DrumColumn
                items={MINUTES}
                selectedIndex={minuteIdx}
                onSelect={handleSelectMinute}
                format={(n) => String(n).padStart(2, "0")}
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const tp = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.semantic.dimBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    width: TP_CARD_W,
    height: TP_CARD_H,
    overflow: "hidden",
    justifyContent: "center",
  },
  // 하이라이트: 카드 중앙 한 행 — left/right 0으로 전체 너비
  highlight: {
    position: "absolute",
    top: (TP_CARD_H - ITEM_HEIGHT) / 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: colors.primary.background,
  },
  columns: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    height: TP_CARD_H,
  },
  drumItem: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  drumText: {
    fontFamily: fontFamily.pretendard.bold,
    fontSize: 24,
    lineHeight: 24,
    color: colors.gray[60],
    textAlign: "center",
  },
  drumTextSelected: {
    fontFamily: fontFamily.pretendard.bold,
    fontSize: 24,
    lineHeight: 24,
    color: colors.primary.default,
  },
  colon: {
    fontFamily: fontFamily.pretendard.bold,
    fontSize: 24,
    lineHeight: 24,
    color: colors.primary.default,
    paddingHorizontal: 8,
  },
  // 확인버튼 없음 (선택 즉시 onConfirm 호출)
  confirmBtn: {},
  confirmText: {},
});

// ────────────────────────────────────────────────────────────────────────────
// NewScheduleSheet
// ────────────────────────────────────────────────────────────────────────────
type PickerMode = "startDate" | "endDate" | "startTime" | "endTime" | null;

interface NewScheduleSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  onClose: () => void;
}

const formatDate = (date: Date) =>
  `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;

const formatTime = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;

export default function NewScheduleSheet({
  bottomSheetRef,
  onClose,
}: NewScheduleSheetProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState(2 / 3);
  const [category, setCategory] = useState<"work" | "personal">("work");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);

  const isDateMode = pickerMode === "startDate" || pickerMode === "endDate";
  const isTimeMode = pickerMode === "startTime" || pickerMode === "endTime";
  const dateValue = pickerMode === "startDate" ? startDate : endDate;
  const timeValue = pickerMode === "startTime" ? startDate : endDate;

  const handleDateConfirm = (date: Date) => {
    const apply = (prev: Date) => {
      const n = new Date(date);
      n.setHours(prev.getHours(), prev.getMinutes());
      return n;
    };
    if (pickerMode === "startDate") setStartDate(apply);
    else if (pickerMode === "endDate") setEndDate(apply);
    setPickerMode(null);
  };

  const handleTimeConfirm = (hour: number, minute: number) => {
    const apply = (prev: Date) => {
      const n = new Date(prev);
      n.setHours(hour, minute);
      return n;
    };
    if (pickerMode === "startTime") setStartDate(apply);
    else if (pickerMode === "endTime") setEndDate(apply);
    setPickerMode(null);
  };

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["89%"]}
        enablePanDownToClose
        onClose={onClose}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={{ height: 0 }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            opacity={0.8}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <ArrowLeft width={36} height={36} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>새 일정 추가</Text>
            <View style={{ width: 36 }} />
          </View>

          {/* 폼 카드 */}
          <View style={styles.card}>
            <TextInput
              style={styles.textInput}
              placeholder="제목"
              placeholderTextColor={colors.semantic.inputPlaceholder}
              value={title}
              onChangeText={setTitle}
            />
            <View style={styles.separator} />
            <TextInput
              style={styles.textInput}
              placeholder="위치"
              placeholderTextColor={colors.semantic.inputPlaceholder}
              value={location}
              onChangeText={setLocation}
            />
            <View style={styles.separator} />

            {/* 시작 */}
            <View style={styles.row}>
              <Text style={styles.rowLabel}>시작</Text>
              <View style={styles.chipRow}>
                <TouchableOpacity
                  style={styles.chip}
                  onPress={() => setPickerMode("startDate")}
                >
                  <Text style={styles.chipText}>{formatDate(startDate)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timeChip}
                  onPress={() => setPickerMode("startTime")}
                >
                  <Text style={styles.chipText}>{formatTime(startDate)}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 종료 */}
            <View style={styles.row}>
              <Text style={styles.rowLabel}>종료</Text>
              <View style={styles.chipRow}>
                <TouchableOpacity
                  style={styles.chip}
                  onPress={() => setPickerMode("endDate")}
                >
                  <Text style={styles.chipText}>{formatDate(endDate)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timeChip}
                  onPress={() => setPickerMode("endTime")}
                >
                  <Text style={styles.chipText}>{formatTime(endDate)}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.separator} />

            {/* 분류 */}
            <View style={styles.row}>
              <Text style={styles.rowLabel}>분류</Text>
              <TouchableOpacity
                onPress={() =>
                  setCategory((p) => (p === "work" ? "personal" : "work"))
                }
              >
                {category === "work" ? (
                  <CategoryWork width={32} height={32} />
                ) : (
                  <CategoryPersonal width={32} height={32} />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />

            {/* 중요도 */}
            <View style={styles.priorityHeader}>
              <Text style={styles.rowLabel}>중요도</Text>
              <InfoIcon width={16} height={16} />
            </View>
            <PrioritySlider value={priority} onChange={setPriority} />
            <View style={styles.separator} />

            {/* 메모 */}
            <View style={styles.row}>
              <Text style={styles.rowLabel}>메모</Text>
              <TextInput
                style={styles.memoInput}
                placeholder="입력"
                placeholderTextColor={colors.semantic.timelineLabel}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitText}>완료</Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>

      <CustomDatePicker
        visible={isDateMode}
        value={dateValue}
        onConfirm={handleDateConfirm}
        onDismiss={() => setPickerMode(null)}
      />

      <CustomTimePicker
        visible={isTimeMode}
        value={timeValue}
        onConfirm={handleTimeConfirm}
        onDismiss={() => setPickerMode(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.primary.background,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontFamily: fontFamily.pretendard.bold,
    fontSize: 20,
    lineHeight: 29,
    color: colors.primary.black,
  },
  card: {
    backgroundColor: colors.gray[100],
    borderRadius: 16,
    paddingHorizontal: 20,
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray[80],
    marginHorizontal: -20,
  },
  textInput: {
    ...typography.body6,
    color: colors.primary.black,
    paddingVertical: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  rowLabel: { ...typography.body6, color: colors.semantic.inputLabel },
  chipRow: { flexDirection: "row", gap: 8 },
  chip: {
    backgroundColor: colors.primary.background,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    width: 104,
    height: 29,
    alignItems: "center",
    justifyContent: "center",
  },
  timeChip: {
    backgroundColor: colors.primary.background,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    width: 65,
    height: 29,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: { ...typography.body6, color: colors.semantic.inputValue },
  priorityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 16,
    paddingBottom: 4,
  },
  memoInput: {
    ...typography.body6,
    color: colors.primary.black,
    flex: 1,
    textAlign: "right",
  },
  submitButton: {
    backgroundColor: colors.primary.black,
    height: 53,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -60,
  },
  submitText: { ...typography.body3, color: colors.gray[100] },
});

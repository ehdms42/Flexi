import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
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
import CategoryWork from "@assets/icons/category-work.svg";
import CategoryPersonal from "@assets/icons/category-personal.svg";
import StarGreen from "@assets/icons/star-green.svg";
import StarYellow from "@assets/icons/star-yellow.svg";
import StarOrange from "@assets/icons/star-orange.svg";
import StarRed from "@assets/icons/star-red.svg";
import InfoIcon from "@assets/icons/info.svg";

const PRIORITY_LEVELS = [0, 1 / 3, 2 / 3, 1] as const;
const THUMB_SIZE = 24;
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
            trackWidth.value = e.nativeEvent.layout.width;
            thumbOffset.value = value;
          }}
        >
          <View style={sliderStyles.track} />
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
  track: { height: 2, backgroundColor: colors.gray[70], borderRadius: 1 },
  thumb: { position: "absolute", width: THUMB_SIZE, height: THUMB_SIZE },
});

interface NewScheduleSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  onClose: () => void;
}

export default function NewScheduleSheet({
  bottomSheetRef,
  onClose,
}: NewScheduleSheetProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState(2 / 3);
  const [category, setCategory] = useState<"work" | "personal">("work");

  return (
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
          {/* 제목 */}
          <TextInput
            style={styles.textInput}
            placeholder="제목"
            placeholderTextColor={colors.semantic.inputPlaceholder}
            value={title}
            onChangeText={setTitle}
          />
          <View style={styles.separator} />

          {/* 위치 */}
          <TextInput
            style={styles.textInput}
            placeholder="위치"
            placeholderTextColor={colors.semantic.inputPlaceholder}
            value={location}
            onChangeText={setLocation}
          />
          <View style={styles.separator} />

          {/* 시작 + 종료 */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>시작</Text>
            <View style={styles.chipRow}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>2025. 4. 17</Text>
              </View>
              <View style={styles.timeChip}>
                <Text style={styles.chipText}>12:00</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>종료</Text>
            <View style={styles.chipRow}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>2025. 4. 17</Text>
              </View>
              <View style={styles.timeChip}>
                <Text style={styles.chipText}>13:00</Text>
              </View>
            </View>
          </View>
          <View style={styles.separator} />

          {/* 분류 */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>분류</Text>
            <TouchableOpacity
              onPress={() =>
                setCategory((prev) => (prev === "work" ? "personal" : "work"))
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

        {/* 완료 */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>완료</Text>
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheet>
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
  rowLabel: {
    ...typography.body6,
    color: colors.semantic.inputLabel,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
  },
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
  chipText: {
    ...typography.body6,
    color: colors.semantic.inputValue,
  },
  priorityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 16,
    paddingBottom: 4,
  },
  placeholder: {
    ...typography.body6,
    color: colors.semantic.timelineLabel,
  },
  submitButton: {
    backgroundColor: colors.primary.black,
    height: 53,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -60,
  },
  submitText: {
    ...typography.body3,
    color: colors.gray[100],
  },
  memoInput: {
    ...typography.body6,
    color: colors.primary.black,
    flex: 1,
    textAlign: "right",
  },
});

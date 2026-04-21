import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { colors } from "@constants/colors";
import { fontFamily } from "@constants/typography";
import { PRIORITY_LEVELS, PRIORITY_ICONS, THUMB_SIZE, DOT_SIZE } from "@constants/schedule";

interface PrioritySliderProps {
  value: number;
  onChange: (v: number) => void;
}

const valueToIndex = (v: number) =>
  PRIORITY_LEVELS.reduce(
    (best, curr, i) =>
      Math.abs(curr - v) < Math.abs(PRIORITY_LEVELS[best] - v) ? i : best,
    0
  );

export default function PrioritySlider({ value, onChange }: PrioritySliderProps) {
  const trackWidth = useSharedValue(0);
  const thumbOffset = useSharedValue(value);
  const startOffset = useSharedValue(value);
  const isDragging = useRef(false);
  const [activeIndex, setActiveIndex] = useState(() => valueToIndex(value));
  const [containerWidth, setContainerWidth] = useState(0);

  const dotPositions =
    containerWidth > 0
      ? PRIORITY_LEVELS.map(
          (level) =>
            level * (containerWidth - THUMB_SIZE) + THUMB_SIZE / 2 - DOT_SIZE / 2
        )
      : [];

  useEffect(() => {
    if (isDragging.current) return;
    const idx = valueToIndex(value);
    thumbOffset.value = withSpring(PRIORITY_LEVELS[idx], { damping: 20, stiffness: 300 });
    setActiveIndex(idx);
  }, [value]);

  const setDragging = (v: boolean) => { isDragging.current = v; };

  const pan = Gesture.Pan()
    .activeOffsetX([-5, 5])
    .failOffsetY([-10, 10])
    .onBegin(() => {
      startOffset.value = thumbOffset.value;
      runOnJS(setDragging)(true);
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
      runOnJS(setDragging)(false);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbOffset.value * (trackWidth.value - THUMB_SIZE) }],
  }));

  const ActiveIcon = PRIORITY_ICONS[activeIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.sideLabel}>보류</Text>
      <GestureDetector gesture={pan}>
        <View
          style={styles.trackContainer}
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            trackWidth.value = w;
            thumbOffset.value = value;
            setContainerWidth(w);
          }}
        >
          <View style={styles.track} />
          {dotPositions.map((left, i) => (
            <View key={i} style={[styles.dot, { left }]} />
          ))}
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <ActiveIcon width={THUMB_SIZE} height={THUMB_SIZE} />
          </Animated.View>
        </View>
      </GestureDetector>
      <Text style={styles.sideLabel}>최우선</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  trackContainer: {
    flex: 1,
    height: THUMB_SIZE,
    justifyContent: "center",
  },
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
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
});

import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, ScrollView } from "react-native";

import { colors } from "@constants/colors";
import { fontFamily } from "@constants/typography";
import { HOURS, ITEM_HEIGHT, MINUTES, TP_CARD_H, TP_CARD_W } from "@constants/schedule";

interface DrumColumnProps {
  items: number[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  format: (n: number) => string;
}

function DrumColumn({ items, selectedIndex, onSelect, format }: DrumColumnProps) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: selectedIndex * ITEM_HEIGHT, animated: false });
    }, 80);
    return () => clearTimeout(timer);
  }, [selectedIndex]);

  const handleMomentumEnd = (e: any) => {
    const idx = Math.max(
      0,
      Math.min(items.length - 1, Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT))
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
            style={[styles.drumItem, { opacity }]}
            activeOpacity={0.7}
            onPress={() => {
              onSelect(idx);
              scrollRef.current?.scrollTo({ y: idx * ITEM_HEIGHT, animated: true });
            }}
          >
            <Text style={[styles.drumText, isSelected && styles.drumTextSelected]}>
              {format(val)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

interface CustomTimePickerProps {
  visible: boolean;
  value: Date;
  onConfirm: (hour: number, minute: number) => void;
  onDismiss: () => void;
}

export default function CustomTimePicker({
  visible,
  value,
  onConfirm,
  onDismiss,
}: CustomTimePickerProps) {
  const [hourIdx, setHourIdx] = useState(value.getHours());
  const [minuteIdx, setMinuteIdx] = useState(Math.round(value.getMinutes() / 5));

  const pendingHour = useRef(value.getHours());
  const pendingMinute = useRef(Math.round(value.getMinutes() / 5) * 5);

  useEffect(() => {
    if (visible) {
      const h = value.getHours();
      const m = Math.round(value.getMinutes() / 5);
      setHourIdx(h);
      setMinuteIdx(m);
      pendingHour.current = HOURS[h];
      pendingMinute.current = MINUTES[m];
    }
  }, [visible]);

  const handleSelectHour = (idx: number) => {
    setHourIdx(idx);
    pendingHour.current = HOURS[idx];
  };

  const handleSelectMinute = (idx: number) => {
    setMinuteIdx(idx);
    pendingMinute.current = MINUTES[idx];
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable
        style={styles.overlay}
        onPress={() => onConfirm(pendingHour.current, pendingMinute.current)}
      >
        <View style={styles.card} onStartShouldSetResponder={() => true}>
            <View style={styles.highlight} pointerEvents="none" />
            <View style={styles.columns}>
              <DrumColumn
                items={HOURS}
                selectedIndex={hourIdx}
                onSelect={handleSelectHour}
                format={(n) => String(n).padStart(2, "0")}
              />
              <Text style={styles.colon}>:</Text>
              <DrumColumn
                items={MINUTES}
                selectedIndex={minuteIdx}
                onSelect={handleSelectMinute}
                format={(n) => String(n).padStart(2, "0")}
              />
            </View>
          </View>
      </Pressable>
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
    borderRadius: 12,
    width: TP_CARD_W,
    height: TP_CARD_H,
    overflow: "hidden",
    justifyContent: "center",
  },
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
    color: colors.primary.default,
  },
  colon: {
    fontFamily: fontFamily.pretendard.bold,
    fontSize: 24,
    lineHeight: 24,
    color: colors.primary.default,
    paddingHorizontal: 8,
  },
});

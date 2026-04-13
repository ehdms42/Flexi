import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import Menu from "@assets/icons/menu.svg";
import Bell from "@assets/icons/bell.svg";
import ChevronDown from "@assets/icons/chevron-down.svg";
import FloatingPlus from "@assets/icons/floating-plus.svg";
import FloatingClose from "@assets/icons/floating-close.svg";
import EditIcon from "@assets/icons/edit.svg";
import NewPlan from "@assets/icons/new-plan.svg";

import WeeklyCalendar from "@components/features/calendar/WeeklyCalendar";
import TimelineView from "@components/features/schedule/TimelineView";
import { colors } from "@constants/colors";
import { fontFamily, typography } from "@constants/typography";
import { MOCK_WEEK_DATES, MOCK_SCHEDULES } from "@/mocks/schedule";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(17);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const opacity = useSharedValue(0);

  const dimStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const closeMenu = () => setIsMenuOpen(false);

  const toggleMenu = () => {
    if (isMenuOpen) {
      opacity.value = withTiming(0, { duration: 200 }, (finished) => {
        if (finished) runOnJS(closeMenu)();
      });
    } else {
      setIsMenuOpen(true);
      opacity.value = withTiming(1, { duration: 200 });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Menu width={42} height={42} />
          <View style={styles.headerRight}>
            <Bell width={42} height={42} />
            <View style={styles.profileCircle} />
          </View>
        </View>

        {/* April + 지연 텍스트 */}
        <View style={styles.monthArea}>
          <View style={styles.monthRow}>
            <Text style={styles.monthText}>April</Text>
            <ChevronDown width={20} height={20} />
          </View>
          <Text style={styles.delayText}>
            오늘 일정 중 <Text style={styles.delayHighlight}>0건이 지연</Text>된
            걸로 확인됐어요.
          </Text>
        </View>

        {/* 주간 캘린더 */}
        <WeeklyCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          weekDates={MOCK_WEEK_DATES}
        />

        {/* 타임라인 */}
        <TimelineView schedules={MOCK_SCHEDULES} />
      </ScrollView>

      {/* 딤 배경 */}
      {isMenuOpen && (
        <Animated.View style={[styles.dim, dimStyle]} onTouchEnd={toggleMenu} />
      )}

      {/* 플로팅 버튼 */}
      <View style={styles.floatingContainer}>
        {isMenuOpen && (
          <View style={styles.floatingMenu}>
            <View style={styles.floatingMenuItem}>
              <Text style={styles.floatingMenuText}>일정 변경</Text>
              <TouchableOpacity style={styles.floatingMenuBtn}>
                <EditIcon width={59} height={59} />
              </TouchableOpacity>
            </View>
            <View style={styles.floatingMenuItem}>
              <Text style={styles.floatingMenuText}>새 일정</Text>
              <TouchableOpacity style={styles.floatingMenuBtn}>
                <NewPlan width={59} height={59} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <TouchableOpacity style={styles.floatingBtn} onPress={toggleMenu}>
          {isMenuOpen ? (
            <FloatingClose width={65} height={65} />
          ) : (
            <FloatingPlus width={65} height={65} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.gray[70],
  },
  monthArea: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  monthText: {
    fontFamily: fontFamily.urbanist.medium,
    fontSize: 36,
    lineHeight: 36,
    color: colors.primary.black,
  },
  delayText: {
    ...typography.body8,
    lineHeight: 20,
    color: colors.gray[60],
  },
  delayHighlight: {
    ...typography.body8,
    color: colors.gray[40],
  },
  dim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.semantic.dimBackground,
  },
  floatingContainer: {
    position: "absolute",
    bottom: 32,
    right: 20,
    alignItems: "flex-end",
    gap: 12,
  },
  floatingMenu: {
    alignItems: "flex-end",
    gap: 12,
  },
  floatingMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  floatingMenuText: {
    ...typography.body8,
    color: colors.gray[100],
  },
  floatingMenuBtn: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingBtn: {
    width: 65,
    height: 65,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

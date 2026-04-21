import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import BottomSheet from '@gorhom/bottom-sheet';

import Menu from '@assets/icons/menu.svg';
import Bell from '@assets/icons/bell.svg';
import ChevronDown from '@assets/icons/chevron-down.svg';
import FloatingPlus from '@assets/icons/floating-plus.svg';
import FloatingClose from '@assets/icons/floating-close.svg';
import EditIcon from '@assets/icons/edit.svg';
import NewPlan from '@assets/icons/new-plan.svg';

import WeeklyCalendar from '@components/features/calendar/WeeklyCalendar';
import TimelineView from '@components/features/schedule/TimelineView';
import NewScheduleSheet from '@components/features/schedule/NewScheduleSheet';
import { colors } from '@constants/colors';
import { fontFamily, typography } from '@constants/typography';
import { MOCK_SCHEDULES } from '@/mocks/schedule';
import { WeekDay } from '@/types/schedule';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'] as const;

const getWeekDates = (date: Date): WeekDay[] => {
  const dow = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - (dow === 0 ? 6 : dow - 1));
  return DAY_NAMES.map((day, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { date: d.getDate(), day };
  });
};

const today = new Date();

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [weekDates] = useState<WeekDay[]>(() => getWeekDates(today));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const newScheduleSheetRef = useRef<BottomSheet>(null);

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

  const openNewSchedule = () => {
    toggleMenu();
    newScheduleSheetRef.current?.expand();
  };

  return (
    <>
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
              <Text style={styles.monthText}>{MONTH_NAMES[today.getMonth()]}</Text>
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
            weekDates={weekDates}
          />

          {/* 타임라인 */}
          <TimelineView schedules={MOCK_SCHEDULES} />
        </ScrollView>

        {/* 딤 배경 */}
        {isMenuOpen && (
          <Pressable style={styles.dimPressable} onPress={toggleMenu} accessibilityLabel="메뉴 닫기">
            <Animated.View style={[styles.dim, dimStyle]} />
          </Pressable>
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
                <TouchableOpacity
                  style={styles.floatingMenuBtn}
                  onPress={openNewSchedule}
                >
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

      <NewScheduleSheet
        bottomSheetRef={newScheduleSheetRef}
        onClose={() => newScheduleSheetRef.current?.close()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
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
  dimPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dim: {
    flex: 1,
    backgroundColor: colors.semantic.dimBackground,
  },
  floatingContainer: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    alignItems: 'flex-end',
    gap: 12,
  },
  floatingMenu: {
    alignItems: 'flex-end',
    gap: 12,
  },
  floatingMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  floatingMenuText: {
    ...typography.body8,
    color: colors.gray[100],
  },
  floatingMenuBtn: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingBtn: {
    width: 65,
    height: 65,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState, RefObject } from "react";
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import { colors } from "@constants/colors";
import { fontFamily, typography } from "@constants/typography";
import ArrowLeft from "@assets/icons/arrow-left.svg";
import CategoryWork from "@assets/icons/category-work.svg";
import CategoryPersonal from "@assets/icons/category-personal.svg";
import InfoIcon from "@assets/icons/info.svg";

import PrioritySlider from "./PrioritySlider";
import CustomDatePicker from "./CustomDatePicker";
import CustomTimePicker from "./CustomTimePicker";
import { useNewScheduleForm } from "@/hooks/useNewScheduleForm";
import { formatDate, formatTime } from "@/utils/dateFormat";
import { createTask, TaskPriority } from "@api/schedules";
import type { PriorityIndex } from "@/types/schedule";

interface NewScheduleSheetProps {
  bottomSheetRef: RefObject<BottomSheet | null>;
  onClose?: () => void;
}

const PRIORITY_INDEX_TO_API: Record<PriorityIndex, TaskPriority> = {
  0: "HOLD",
  1: "NORMAL",
  2: "HIGH",
  3: "HIGHEST",
};

const toApiDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const toApiTime = (d: Date) =>
  `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:00`;

export default function NewScheduleSheet({ bottomSheetRef, onClose }: NewScheduleSheetProps) {
  const close = () => bottomSheetRef.current?.close();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    form,
    isDateMode,
    isTimeMode,
    isValidRange,
    datePickerValue,
    timePickerValue,
    setPickerMode,
    setTitle,
    setLocation,
    setPriority,
    setMemo,
    toggleCategory,
    handleDateConfirm,
    handleTimeConfirm,
    reset,
  } = useNewScheduleForm();

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["89%"]}
        enablePanDownToClose
        onClose={() => { reset(); onClose?.(); }}
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
          <View style={styles.header}>
            <TouchableOpacity onPress={close}>
              <ArrowLeft width={36} height={36} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>새 일정 추가</Text>
            <View style={{ width: 36 }} />
          </View>

          <View style={styles.card}>
            <TextInput
              style={styles.textInput}
              placeholder="제목"
              placeholderTextColor={colors.semantic.inputPlaceholder}
              value={form.title}
              onChangeText={setTitle}
            />
            <View style={styles.separator} />

            <TextInput
              style={styles.textInput}
              placeholder="위치"
              placeholderTextColor={colors.semantic.inputPlaceholder}
              value={form.location}
              onChangeText={setLocation}
            />
            <View style={styles.separator} />

            <View style={styles.row}>
              <Text style={styles.rowLabel}>시작</Text>
              <View style={styles.chipRow}>
                <TouchableOpacity style={styles.chip} onPress={() => setPickerMode("startDate")}>
                  <Text style={styles.chipText}>{formatDate(form.startDate)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.timeChip} onPress={() => setPickerMode("startTime")}>
                  <Text style={styles.chipText}>{formatTime(form.startDate)}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>종료</Text>
              <View style={styles.chipRow}>
                <TouchableOpacity style={styles.chip} onPress={() => setPickerMode("endDate")}>
                  <Text style={styles.chipText}>{formatDate(form.endDate)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.timeChip} onPress={() => setPickerMode("endTime")}>
                  <Text style={styles.chipText}>{formatTime(form.endDate)}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.separator} />

            <View style={styles.row}>
              <Text style={styles.rowLabel}>분류</Text>
              <TouchableOpacity onPress={toggleCategory}>
                {form.category === "work" ? (
                  <CategoryWork width={32} height={32} />
                ) : (
                  <CategoryPersonal width={32} height={32} />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />

            <View style={styles.priorityHeader}>
              <Text style={styles.rowLabel}>중요도</Text>
              <InfoIcon width={16} height={16} />
            </View>
            <PrioritySlider value={form.priority} onChange={setPriority} />
            <View style={styles.separator} />

            <View style={styles.row}>
              <Text style={styles.rowLabel}>메모</Text>
              <TextInput
                style={styles.memoInput}
                placeholder="입력"
                placeholderTextColor={colors.semantic.timelineLabel}
                value={form.memo}
                onChangeText={setMemo}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            disabled={isLoading || isSubmitting}
            onPress={async () => {
              if (isSubmitting) return;

              if (!form.title) {
                Alert.alert("입력 오류", "제목을 입력해주세요.");
                return;
              }
              if (!isValidRange) {
                Alert.alert("입력 오류", "종료 시간은 시작 시간보다 늦어야 합니다.");
                return;
              }

              setIsSubmitting(true);
              setIsLoading(true);
              try {
                await createTask({
                  date: toApiDate(form.startDate),
                  title: form.title,
                  startTime: toApiTime(form.startDate),
                  endTime: toApiTime(form.endDate),
                  priority: PRIORITY_INDEX_TO_API[form.priority],
                });
                close();
              } catch (e: any) {
                Alert.alert("일정 생성 실패", e.message);
              } finally {
                setIsLoading(false);
                setIsSubmitting(false);
              }
            }}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.gray[100]} />
            ) : (
              <Text style={styles.submitText}>완료</Text>
            )}
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>

      <CustomDatePicker
        visible={isDateMode}
        value={datePickerValue}
        onConfirm={handleDateConfirm}
        onDismiss={() => setPickerMode(null)}
      />

      <CustomTimePicker
        visible={isTimeMode}
        value={timePickerValue}
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
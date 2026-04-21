import { useState } from "react";
import { CategoryType, DatePickerMode, NewScheduleForm, PriorityIndex } from "@/types/schedule";

const DEFAULT_DURATION_MS = 60 * 60 * 1000; // 1시간

const makeInitialForm = (): NewScheduleForm => {
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + DEFAULT_DURATION_MS);
  return { title: "", location: "", priority: 2 as PriorityIndex, category: "work", startDate, endDate, memo: "" };
};

export function useNewScheduleForm() {
  const [form, setForm] = useState<NewScheduleForm>(makeInitialForm);
  const [pickerMode, setPickerMode] = useState<DatePickerMode>(null);

  const setTitle = (title: string) => setForm((prev) => ({ ...prev, title }));
  const setLocation = (location: string) => setForm((prev) => ({ ...prev, location }));
  const setPriority = (priority: PriorityIndex) => setForm((prev) => ({ ...prev, priority }));
  const setMemo = (memo: string) => setForm((prev) => ({ ...prev, memo }));

  const toggleCategory = () =>
    setForm((prev) => ({
      ...prev,
      category: (prev.category === "work" ? "personal" : "work") as CategoryType,
    }));

  const clampEnd = (startDate: Date, endDate: Date): Date =>
    endDate <= startDate
      ? new Date(startDate.getTime() + DEFAULT_DURATION_MS)
      : endDate;

  const handleDateConfirm = (date: Date) => {
    const applyDate = (prev: Date) => {
      const next = new Date(date);
      next.setHours(prev.getHours(), prev.getMinutes());
      return next;
    };
    if (pickerMode === "startDate") {
      setForm((prev) => {
        const startDate = applyDate(prev.startDate);
        return { ...prev, startDate, endDate: clampEnd(startDate, prev.endDate) };
      });
    } else if (pickerMode === "endDate") {
      setForm((prev) => ({ ...prev, endDate: applyDate(prev.endDate) }));
    }
    setPickerMode(null);
  };

  const handleTimeConfirm = (hour: number, minute: number) => {
    const applyTime = (prev: Date) => {
      const next = new Date(prev);
      next.setHours(hour, minute);
      return next;
    };
    if (pickerMode === "startTime") {
      setForm((prev) => {
        const startDate = applyTime(prev.startDate);
        return { ...prev, startDate, endDate: clampEnd(startDate, prev.endDate) };
      });
    } else if (pickerMode === "endTime") {
      setForm((prev) => ({ ...prev, endDate: applyTime(prev.endDate) }));
    }
    setPickerMode(null);
  };

  const reset = () => {
    setForm(makeInitialForm());
    setPickerMode(null);
  };

  const isValidRange = form.endDate > form.startDate;

  const isDateMode = pickerMode === "startDate" || pickerMode === "endDate";
  const isTimeMode = pickerMode === "startTime" || pickerMode === "endTime";
  const datePickerValue = pickerMode === "startDate" ? form.startDate : form.endDate;
  const timePickerValue = pickerMode === "startTime" ? form.startDate : form.endDate;

  return {
    form,
    pickerMode,
    setPickerMode,
    isDateMode,
    isTimeMode,
    isValidRange,
    datePickerValue,
    timePickerValue,
    setTitle,
    setLocation,
    setPriority,
    setMemo,
    toggleCategory,
    handleDateConfirm,
    handleTimeConfirm,
    reset,
  };
}

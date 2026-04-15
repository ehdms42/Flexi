import { useState } from "react";
import { CategoryType, DatePickerMode, NewScheduleForm } from "@/types/schedule";

const initialForm: NewScheduleForm = {
  title: "",
  location: "",
  priority: 2 / 3,
  category: "work",
  startDate: new Date(),
  endDate: new Date(),
  memo: "",
};

export function useNewScheduleForm() {
  const [form, setForm] = useState<NewScheduleForm>(initialForm);
  const [pickerMode, setPickerMode] = useState<DatePickerMode>(null);

  const setTitle = (title: string) => setForm((prev) => ({ ...prev, title }));
  const setLocation = (location: string) => setForm((prev) => ({ ...prev, location }));
  const setPriority = (priority: number) => setForm((prev) => ({ ...prev, priority }));
  const setMemo = (memo: string) => setForm((prev) => ({ ...prev, memo }));

  const toggleCategory = () =>
    setForm((prev) => ({
      ...prev,
      category: (prev.category === "work" ? "personal" : "work") as CategoryType,
    }));

  const handleDateConfirm = (date: Date) => {
    const applyDate = (prev: Date) => {
      const next = new Date(date);
      next.setHours(prev.getHours(), prev.getMinutes());
      return next;
    };
    if (pickerMode === "startDate") setForm((prev) => ({ ...prev, startDate: applyDate(prev.startDate) }));
    else if (pickerMode === "endDate") setForm((prev) => ({ ...prev, endDate: applyDate(prev.endDate) }));
    setPickerMode(null);
  };

  const handleTimeConfirm = (hour: number, minute: number) => {
    const applyTime = (prev: Date) => {
      const next = new Date(prev);
      next.setHours(hour, minute);
      return next;
    };
    if (pickerMode === "startTime") setForm((prev) => ({ ...prev, startDate: applyTime(prev.startDate) }));
    else if (pickerMode === "endTime") setForm((prev) => ({ ...prev, endDate: applyTime(prev.endDate) }));
    setPickerMode(null);
  };

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
    datePickerValue,
    timePickerValue,
    setTitle,
    setLocation,
    setPriority,
    setMemo,
    toggleCategory,
    handleDateConfirm,
    handleTimeConfirm,
  };
}

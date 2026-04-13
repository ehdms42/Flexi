import { View, Text, StyleSheet } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";

import { colors } from "@constants/colors";
import { typography } from "@constants/typography";

interface NewScheduleSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  onClose: () => void;
}

export default function NewScheduleSheet({
  bottomSheetRef,
  onClose,
}: NewScheduleSheetProps) {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={["80%"]}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.container}>
        <Text style={styles.title}>새 일정 추가</Text>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.primary.background,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  handleIndicator: {
    backgroundColor: colors.gray[70],
    width: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    ...typography.body1,
    color: colors.primary.black,
    textAlign: "center",
    marginBottom: 24,
  },
});

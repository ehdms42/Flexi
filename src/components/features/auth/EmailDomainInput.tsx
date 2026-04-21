import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

import RegisterArrow from "@assets/icons/register-arrow.svg";
import { colors } from "@constants/colors";
import { fontFamily } from "@constants/typography";

const EMAIL_DOMAINS = ["gmail.com", "naver.com", "daum.net", "nate.com", "hanmail.net"];

interface Props {
  email: string;
  domain: string;
  hasError?: boolean;
  onEmailChange: (value: string) => void;
  onDomainChange: (value: string) => void;
}

export default function EmailDomainInput({
  email,
  domain,
  hasError,
  onEmailChange,
  onDomainChange,
}: Props) {
  const [isDirect, setIsDirect] = useState(true);
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.row}>
      <TextInput
        style={[styles.input, styles.flex, hasError && styles.inputError]}
        placeholder="이메일"
        placeholderTextColor={colors.gray[70]}
        value={email}
        onChangeText={onEmailChange}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Text style={styles.atSign}>@</Text>
      <View style={styles.pickerWrapper}>
        <View
          style={[
            styles.input,
            styles.pickerButton,
            showPicker && styles.pickerActive,
            hasError && styles.inputError,
          ]}
        >
          {isDirect ? (
            <TextInput
              style={styles.directInput}
              placeholder="직접 입력"
              placeholderTextColor={colors.gray[70]}
              value={domain}
              onChangeText={onDomainChange}
              autoCapitalize="none"
              editable={!showPicker}
            />
          ) : (
            <TouchableOpacity style={styles.flex} onPress={() => setShowPicker((v) => !v)}>
              <Text style={styles.domainText}>{domain}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setShowPicker((v) => !v)} hitSlop={8}>
            <RegisterArrow
              width={16}
              height={16}
              color={showPicker ? colors.primary.black : colors.gray[60]}
              style={{ transform: [{ rotate: showPicker ? "180deg" : "0deg" }] }}
            />
          </TouchableOpacity>
        </View>
        {showPicker && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setIsDirect(true);
                onDomainChange("");
                setShowPicker(false);
              }}
            >
              <Text style={styles.dropdownText}>직접 입력</Text>
            </TouchableOpacity>
            {EMAIL_DOMAINS.map((d) => (
              <TouchableOpacity
                key={d}
                style={styles.dropdownItem}
                onPress={() => {
                  setIsDirect(false);
                  onDomainChange(d);
                  setShowPicker(false);
                }}
              >
                <Text style={styles.dropdownText}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  flex: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 53,
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 16,
    color: colors.primary.black,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: colors.system.error,
  },
  atSign: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 16,
    color: colors.gray[50],
  },
  pickerWrapper: {
    flex: 1,
    position: "relative",
    zIndex: 10,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  pickerActive: {
    borderColor: colors.primary.black,
  },
  directInput: {
    flex: 1,
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 16,
    color: colors.primary.black,
    padding: 0,
  },
  domainText: {
    flex: 1,
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 16,
    color: colors.gray[50],
  },
  dropdown: {
    position: "absolute",
    top: 57,
    left: 0,
    right: 0,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: colors.primary.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    fontFamily: fontFamily.pretendard.regular,
    fontSize: 14,
    color: colors.gray[40],
  },
});

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
} from "react-native";

import { useRouter } from "expo-router";

import ArrowLeft from "@assets/icons/arrow-left.svg";
import { colors } from "@constants/colors";
import { fontFamily } from "@constants/typography";

const EMAIL_DOMAINS = [
  "gmail.com",
  "naver.com",
  "daum.net",
  "nate.com",
  "hanmail.net",
];

type TabType = "id" | "password";
type StepType = "form" | "result";

export default function FindIdScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<TabType>("id");
  const [step, setStep] = useState<StepType>("form");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [isDomainDirect, setIsDomainDirect] = useState(true);
  const [showDomainPicker, setShowDomainPicker] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    verifyCode: "",
  });

  const isFormFilled = name && email && emailDomain && verifyCode;

  const handleSubmit = () => {
    const emailError = email ? "" : "error";
    const verifyError = verifyCode ? "" : "error";
    setErrors({ email: emailError, verifyCode: verifyError });
    if (!emailError && !verifyError) {
      setStep("result");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>아이디 찾기</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 탭 */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === "id" && styles.tabActive]}
          onPress={() => {
            setTab("id");
            setStep("form");
          }}
        >
          <Text style={[styles.tabText, tab === "id" && styles.tabTextActive]}>
            아이디 찾기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "password" && styles.tabActive]}
          onPress={() => setTab("password")}
        >
          <Text
            style={[styles.tabText, tab === "password" && styles.tabTextActive]}
          >
            비밀번호 찾기
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {step === "form" ? (
          <>
            <Text style={styles.guideText}>
              {"가입 시 입력한 정보로\n아이디를 찾아보세요."}
            </Text>

            {/* 이름 */}
            <TextInput
              style={[styles.input, { marginBottom: 8 }]}
              placeholder="이름"
              placeholderTextColor={colors.gray[70]}
              value={name}
              onChangeText={setName}
            />

            {/* 이메일 */}
            <View style={styles.emailRow}>
              <TextInput
                style={[
                  styles.input,
                  styles.flexInput,
                  errors.email ? styles.inputError : null,
                ]}
                placeholder="이메일"
                placeholderTextColor={colors.gray[70]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <Text style={styles.atSign}>@</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.domainPicker,
                  isDomainDirect ? styles.domainPickerSelected : null,
                  errors.email ? styles.inputError : null,
                ]}
                onPress={() => setShowDomainPicker(true)}
              >
                {isDomainDirect ? (
                  <TextInput
                    style={styles.domainDirectInput}
                    placeholder="직접 입력"
                    placeholderTextColor={colors.gray[70]}
                    value={emailDomain}
                    onChangeText={setEmailDomain}
                    autoCapitalize="none"
                  />
                ) : (
                  <Text style={styles.domainText}>{emailDomain}</Text>
                )}
                <Text style={styles.dropdownArrow}>∨</Text>
              </TouchableOpacity>
            </View>

            {/* 도메인 모달 */}
            <Modal
              visible={showDomainPicker}
              transparent
              animationType="fade"
              onRequestClose={() => setShowDomainPicker(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowDomainPicker(false)}
              >
                <View style={styles.domainDropdown}>
                  <TouchableOpacity
                    style={styles.domainItem}
                    onPress={() => {
                      setIsDomainDirect(true);
                      setEmailDomain("");
                      setShowDomainPicker(false);
                    }}
                  >
                    <Text style={styles.domainItemText}>직접 입력</Text>
                  </TouchableOpacity>
                  {EMAIL_DOMAINS.map((domain) => (
                    <TouchableOpacity
                      key={domain}
                      style={styles.domainItem}
                      onPress={() => {
                        setIsDomainDirect(false);
                        setEmailDomain(domain);
                        setShowDomainPicker(false);
                      }}
                    >
                      <Text style={styles.domainItemText}>{domain}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>

            {/* 인증번호 */}
            <View style={[styles.rowInput, { marginTop: 8 }]}>
              <TextInput
                style={[
                  styles.input,
                  styles.flexInput,
                  errors.verifyCode ? styles.inputError : null,
                ]}
                placeholder="인증번호 입력"
                placeholderTextColor={colors.gray[70]}
                value={verifyCode}
                onChangeText={setVerifyCode}
                keyboardType="number-pad"
              />
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>인증번호 전송</Text>
              </TouchableOpacity>
            </View>

            {errors.email ? (
              <Text style={styles.errorText}>
                ⊙ 이메일 주소를 확인해주세요.
              </Text>
            ) : null}
            {errors.verifyCode ? (
              <Text style={styles.errorText}>⊙ 인증 번호를 확인해주세요.</Text>
            ) : null}
          </>
        ) : (
          <>
            <Text style={styles.resultGuideText}>
              {"이메일 주소와\n일치하는 "}
              <Text style={styles.resultHighlight}>아이디</Text>
              {"입니다."}
            </Text>
            <View style={styles.resultCard}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>아이디</Text>
                <Text style={styles.resultValue}>junhokim0138</Text>
              </View>
              <View style={styles.resultDivider} />
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>가입일</Text>
                <Text style={styles.resultValue}>2024.12.1</Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* 완료 / 로그인 바로가기 버튼 */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            step === "form" && !isFormFilled && styles.submitButtonDisabled,
          ]}
          onPress={
            step === "result"
              ? () => router.push("/(auth)/login")
              : handleSubmit
          }
          disabled={step === "form" && !isFormFilled}
        >
          <Text style={styles.submitText}>
            {step === "result" ? "로그인 바로가기" : "완료"}
          </Text>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.semantic.backgroundStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: fontFamily.pretendard.bold,
    fontSize: 20,
    lineHeight: 29,
    color: colors.primary.black,
  },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: colors.primary.background,
    shadowColor: colors.primary.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 14,
    color: colors.gray[60],
  },
  tabTextActive: {
    fontFamily: fontFamily.pretendard.bold,
    color: colors.primary.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  guideText: {
    fontFamily: fontFamily.pretendard.bold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.primary.black,
    marginBottom: 24,
  },
  rowInput: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  flexInput: {
    flex: 1,
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
  domainPicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    paddingHorizontal: 12,
  },
  domainPickerSelected: {
    borderColor: colors.primary.black,
  },
  domainDirectInput: {
    flex: 1,
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 16,
    color: colors.primary.black,
    padding: 0,
  },
  domainText: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 16,
    color: colors.gray[50],
    flex: 1,
  },
  dropdownArrow: {
    color: colors.gray[50],
    fontSize: 12,
  },
  atSign: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 16,
    color: colors.gray[50],
  },
  actionButton: {
    backgroundColor: colors.primary.black,
    borderRadius: 12,
    width: 124,
    height: 53,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontFamily: fontFamily.pretendard.bold,
    fontSize: 16,
    lineHeight: 16,
    color: colors.gray[100],
  },
  errorText: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 12,
    color: colors.system.error,
    marginTop: 6,
  },
  resultGuideText: {
    fontFamily: fontFamily.pretendard.bold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.primary.black,
    marginBottom: 24,
  },
  resultHighlight: {
    color: colors.primary.default,
  },
  resultCard: {
    backgroundColor: colors.semantic.backgroundStrong,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 16,
  },
  resultDivider: {
    height: 1,
    backgroundColor: colors.gray[80],
  },
  resultLabel: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 14,
    color: colors.gray[50],
    width: 48,
  },
  resultValue: {
    fontFamily: fontFamily.pretendard.bold,
    fontSize: 14,
    color: colors.primary.black,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  domainDropdown: {
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    width: 150,
    paddingVertical: 8,
    shadowColor: colors.primary.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  domainItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  domainItemText: {
    fontFamily: fontFamily.pretendard.regular,
    fontSize: 14,
    lineHeight: 14,
    color: colors.gray[40],
  },
  bottomArea: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  submitButton: {
    backgroundColor: colors.primary.black,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray[70],
  },
  submitText: {
    fontFamily: fontFamily.pretendard.bold,
    fontSize: 16,
    color: colors.gray[100],
  },
});

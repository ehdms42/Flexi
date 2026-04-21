import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import ArrowLeft from "@assets/icons/arrow-left.svg";
import CloseEyes from "@assets/icons/close-eyes.svg";
import OpenEyes from "@assets/icons/open-eyes.svg";
import EmailDomainInput from "@components/features/auth/EmailDomainInput";
import { colors } from "@constants/colors";
import { fontFamily } from "@constants/typography";

type TabType = "id" | "password";
type StepType = "form" | "result";

const validatePassword = (value: string) => {
  const regex =
    /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/;
  return regex.test(value) ? "" : "format";
};

export default function FindIdScreen() {
  const router = useRouter();
  const { tab: initialTab } = useLocalSearchParams<{ tab?: string }>();

  const [tab, setTab] = useState<TabType>(
    initialTab === "password" ? "password" : "id"
  );
  const [step, setStep] = useState<StepType>("form");

  // 아이디 찾기
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [errors, setErrors] = useState({ email: false, verifyCode: false });

  // 비밀번호 찾기
  const [pwUserId, setPwUserId] = useState("");
  const [pwEmail, setPwEmail] = useState("");
  const [pwDomain, setPwDomain] = useState("");
  const [pwVerifyCode, setPwVerifyCode] = useState("");
  const [pwErrors, setPwErrors] = useState({ email: false, verifyCode: false });
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [resetErrors, setResetErrors] = useState({ password: "", confirm: "" });

  const isIdFormFilled = !!(name && email && domain && verifyCode);
  const isPwFormFilled = !!(pwUserId && pwEmail && pwDomain && pwVerifyCode);
  const isResetFilled = !!(password && passwordConfirm);

  const switchTab = (next: TabType) => {
    setTab(next);
    setStep("form");
  };

  const handleIdSubmit = () => {
    const emailErr = !email;
    const verifyErr = !verifyCode;
    setErrors({ email: emailErr, verifyCode: verifyErr });
    if (!emailErr && !verifyErr) setStep("result");
  };

  const handlePwNext = () => {
    const emailErr = !pwEmail;
    const verifyErr = !pwVerifyCode;
    setPwErrors({ email: emailErr, verifyCode: verifyErr });
    if (!emailErr && !verifyErr) setStep("result");
  };

  const handlePwReset = () => {
    const passwordErr = validatePassword(password);
    const confirmErr = password !== passwordConfirm ? "mismatch" : "";
    setResetErrors({ password: passwordErr, confirm: confirmErr });
    if (!passwordErr && !confirmErr) router.push("/(auth)/login");
  };

  const getDisabled = () => {
    if (tab === "id") return step === "form" ? !isIdFormFilled : false;
    return step === "form" ? !isPwFormFilled : !isResetFilled;
  };

  const handleSubmit = () => {
    if (tab === "id") {
      step === "result" ? router.push("/(auth)/login") : handleIdSubmit();
    } else {
      step === "result" ? handlePwReset() : handlePwNext();
    }
  };

  const getButtonLabel = () => {
    if (tab === "id") return step === "result" ? "로그인 바로가기" : "완료";
    return step === "result" ? "완료" : "다음";
  };

  const disabled = getDisabled();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft width={36} height={36} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {tab === "id" ? "아이디 찾기" : "비밀번호 찾기"}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === "id" && styles.tabActive]}
          onPress={() => switchTab("id")}
        >
          <Text style={[styles.tabText, tab === "id" && styles.tabTextActive]}>
            아이디 찾기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "password" && styles.tabActive]}
          onPress={() => switchTab("password")}
        >
          <Text style={[styles.tabText, tab === "password" && styles.tabTextActive]}>
            비밀번호 찾기
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {tab === "id" ? (
          step === "form" ? (
            <>
              <Text style={styles.guideText}>
                {"가입 시 입력한 정보로\n아이디를 찾아보세요."}
              </Text>
              <TextInput
                style={[styles.input, { marginBottom: 8 }]}
                placeholder="이름"
                placeholderTextColor={colors.gray[70]}
                value={name}
                onChangeText={setName}
              />
              <EmailDomainInput
                email={email}
                domain={domain}
                hasError={errors.email}
                onEmailChange={setEmail}
                onDomainChange={setDomain}
              />
              <View style={[styles.rowInput, { marginTop: 8 }]}>
                <TextInput
                  style={[styles.input, styles.flex, errors.verifyCode && styles.inputError]}
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
              {errors.email && (
                <Text style={styles.errorText}>⊙ 이메일 주소를 확인해주세요.</Text>
              )}
              {errors.verifyCode && (
                <Text style={styles.errorText}>⊙ 인증 번호를 확인해주세요.</Text>
              )}
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
                  <Text style={styles.resultValueId}>junhokim0138</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>가입일</Text>
                  <Text style={styles.resultValue}>2024.12.1</Text>
                </View>
              </View>
            </>
          )
        ) : step === "form" ? (
          <>
            <Text style={styles.guideText}>
              {"이메일 인증 후\n새 비밀번호를 등록해주세요."}
            </Text>
            <TextInput
              style={[styles.input, { marginBottom: 8 }]}
              placeholder="아이디 입력"
              placeholderTextColor={colors.gray[70]}
              value={pwUserId}
              onChangeText={setPwUserId}
              autoCapitalize="none"
            />
            <EmailDomainInput
              email={pwEmail}
              domain={pwDomain}
              hasError={pwErrors.email}
              onEmailChange={setPwEmail}
              onDomainChange={setPwDomain}
            />
            <View style={[styles.rowInput, { marginTop: 8 }]}>
              <TextInput
                style={[styles.input, styles.flex, pwErrors.verifyCode && styles.inputError]}
                placeholder="인증번호 입력"
                placeholderTextColor={colors.gray[70]}
                value={pwVerifyCode}
                onChangeText={setPwVerifyCode}
                keyboardType="number-pad"
              />
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>인증번호 전송</Text>
              </TouchableOpacity>
            </View>
            {pwErrors.email && (
              <Text style={styles.errorText}>⊙ 이메일 주소를 확인해주세요.</Text>
            )}
            {pwErrors.verifyCode && (
              <Text style={styles.errorText}>⊙ 인증 번호를 확인해주세요.</Text>
            )}
          </>
        ) : (
          <>
            <Text style={styles.guideText}>
              {"새로 사용할\n비밀번호를 입력해주세요."}
            </Text>
            <View
              style={[
                styles.input,
                styles.passwordRow,
                resetErrors.password && styles.inputError,
                { marginBottom: 8 },
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="비밀번호"
                placeholderTextColor={colors.gray[70]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                {showPassword ? (
                  <OpenEyes width={20} height={20} color={colors.gray[60]} />
                ) : (
                  <CloseEyes width={20} height={20} color={colors.gray[60]} />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.input,
                styles.passwordRow,
                resetErrors.confirm && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="비밀번호 확인"
                placeholderTextColor={colors.gray[70]}
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                secureTextEntry={!showPasswordConfirm}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPasswordConfirm((v) => !v)}>
                {showPasswordConfirm ? (
                  <OpenEyes width={20} height={20} color={colors.gray[60]} />
                ) : (
                  <CloseEyes width={20} height={20} color={colors.gray[60]} />
                )}
              </TouchableOpacity>
            </View>
            {resetErrors.password === "format" ? (
              <Text style={styles.errorText}>
                ⊙ 6~20자/영문 대문자, 소문자, 숫자, 특수문자 중 2가지 이상 조합
              </Text>
            ) : (
              <Text style={styles.hintText}>
                6~20자/영문 대문자, 소문자, 숫자, 특수문자 중 2가지 이상 조합
              </Text>
            )}
            {resetErrors.confirm === "mismatch" && (
              <Text style={styles.errorText}>⊙ 비밀번호가 일치하지 않습니다.</Text>
            )}
          </>
        )}
      </View>

      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={[styles.submitButton, disabled && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={disabled}
        >
          <Text
            style={[
              styles.submitText,
              disabled ? styles.submitTextDisabled : styles.submitTextActive,
            ]}
          >
            {getButtonLabel()}
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
    backgroundColor: colors.gray[95],
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
    backgroundColor: colors.gray[100],
    shadowColor: colors.primary.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 16,
    lineHeight: 16 * 1.46,
    color: colors.gray[60],
  },
  tabTextActive: {
    fontFamily: fontFamily.pretendard.bold,
    color: colors.gray[30],
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  guideText: {
    fontFamily: fontFamily.pretendard.semiBold,
    fontSize: 20,
    lineHeight: 20 * 1.44,
    color: colors.gray[10],
    marginBottom: 24,
    width: 353,
    height: 58,
  },
  rowInput: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  flex: {
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
    color: colors.gray[100],
  },
  errorText: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 12,
    color: colors.system.error,
    marginTop: 6,
  },
  hintText: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 12,
    color: colors.gray[60],
    marginTop: 6,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 16,
    color: colors.primary.black,
    padding: 0,
  },
  resultGuideText: {
    fontFamily: fontFamily.pretendard.semiBold,
    fontSize: 20,
    lineHeight: 20 * 1.44,
    color: colors.gray[10],
    marginBottom: 24,
    width: 353,
  },
  resultHighlight: {
    fontFamily: fontFamily.pretendard.bold,
    fontSize: 20,
    lineHeight: 20 * 1.44,
    color: colors.primary.default,
  },
  resultCard: {
    backgroundColor: colors.semantic.backgroundStrong,
    borderRadius: 12,
    paddingLeft: 54,
    paddingRight: 20,
    paddingVertical: 41,
    gap: 28,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 23,
    gap: 16,
  },
  resultLabel: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 14,
    lineHeight: 14 * 1.4,
    color: colors.gray[50],
  },
  resultValueId: {
    fontFamily: fontFamily.pretendard.semiBold,
    fontSize: 16,
    lineHeight: 16 * 1.44,
    color: colors.gray[10],
  },
  resultValue: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 16,
    lineHeight: 16 * 1.44,
    color: colors.gray[30],
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
    backgroundColor: colors.primary.black,
  },
  submitText: {
    fontFamily: fontFamily.pretendard.bold,
    fontSize: 16,
  },
  submitTextDisabled: {
    color: colors.gray[40],
  },
  submitTextActive: {
    color: colors.gray[100],
  },
});

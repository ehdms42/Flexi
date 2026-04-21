import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";

import ArrowLeft from "@assets/icons/arrow-left.svg";
import ArrowDown from "@assets/icons/register-arrow.svg";
import ErrorImg from "@assets/icons/error.svg";
import OpenEyes from "@assets/icons/open-eyes.svg";
import CloseEyes from "@assets/icons/close-eyes.svg";
import { colors } from "@constants/colors";
import { signUp, checkUsername } from "@api/users";
import { fontFamily, typography } from "@constants/typography";

const EMAIL_DOMAINS = [
  "gmail.com",
  "naver.com",
  "daum.net",
  "nate.com",
  "hanmail.net",
];

export default function RegisterScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [showDomainPicker, setShowDomainPicker] = useState(false);
  const [isDomainDirect, setIsDomainDirect] = useState(true);
  const [verifyCode, setVerifyCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
    verifyCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const validateEmail = (localPart: string, domain: string) => {
    if (!localPart || localPart.length === 0 || !domain || !domain.includes(".")) {
      return "이메일 주소를 확인해주세요.";
    }
    if (!/^[a-zA-Z0-9._%+\-]+$/.test(localPart)) {
      return "이메일 주소를 확인해주세요.";
    }
    return "";
  };

  const validateUsername = (value: string) => {
    if (!value || value.length < 4 || value.length > 12) {
      return "아이디를 확인해주세요.";
    }
    return "";
  };

  const validatePassword = (value: string) => {
    if (value.length < 6 || value.length > 20) {
      return "6~20자/영문 대문자, 소문자, 숫자, 특수문자(!@#$%^&*) 중 2가지 이상 조합";
    }
    if (!/^[a-zA-Z0-9!@#$%^&*]+$/.test(value)) {
      return "6~20자/영문 대문자, 소문자, 숫자, 특수문자(!@#$%^&*) 중 2가지 이상 조합";
    }
    const typeCount = [/[A-Z]/, /[a-z]/, /[0-9]/, /[!@#$%^&*]/].filter((r) =>
      r.test(value)
    ).length;
    if (typeCount < 2) {
      return "6~20자/영문 대문자, 소문자, 숫자, 특수문자(!@#$%^&*) 중 2가지 이상 조합";
    }
    return "";
  };

  const isFormValid =
    isUsernameAvailable &&
    username.length >= 4 &&
    username.length <= 12 &&
    validatePassword(password) === "" &&
    password === passwordConfirm &&
    email.length > 0 &&
    emailDomain.length > 0 &&
    verifyCode.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 헤더 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft width={36} height={36} />
        </TouchableOpacity>

        {/* 아이디 */}
        <View style={styles.section}>
          <Text style={styles.label}>아이디</Text>
          <View style={styles.rowInput}>
            <TextInput
              style={[
                styles.input,
                styles.flexInput,
                errors.username ? styles.inputError : null,
              ]}
              placeholder="아이디 입력"
              placeholderTextColor={colors.gray[70]}
              value={username}
              onChangeText={(v) => { setUsername(v); setIsUsernameAvailable(false); }}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.actionButton}
              disabled={isCheckingUsername}
              onPress={async () => {
                const usernameError = validateUsername(username);
                if (usernameError) {
                  setErrors((prev) => ({ ...prev, username: usernameError }));
                  return;
                }
                setIsCheckingUsername(true);
                try {
                  await checkUsername(username);
                  setIsUsernameAvailable(true);
                  setErrors((prev) => ({ ...prev, username: "" }));
                  Alert.alert("사용 가능", "사용 가능한 아이디입니다.");
                } catch (e: any) {
                  setIsUsernameAvailable(false);
                  setErrors((prev) => ({ ...prev, username: e.message }));
                } finally {
                  setIsCheckingUsername(false);
                }
              }}
            >
              {isCheckingUsername ? (
                <ActivityIndicator color={colors.gray[100]} />
              ) : (
                <Text style={styles.actionButtonText}>중복 확인</Text>
              )}
            </TouchableOpacity>
          </View>
          {errors.username ? (
            <View style={styles.errorRow}>
              <ErrorImg width={14} height={14} />
              <Text style={styles.errorText}>{errors.username}</Text>
            </View>
          ) : (
            <Text style={styles.hintText}>
              4~12자/영문 소문자 (숫자 조합 가능)
            </Text>
          )}
        </View>

        {/* 비밀번호 */}
        <View style={styles.section}>
          <Text style={styles.label}>비밀번호</Text>
          <View
            style={[
              styles.input,
              styles.passwordRow,
              errors.password ? styles.inputError : null,
            ]}
          >
            <TextInput
              style={styles.passwordInput}
              placeholder="비밀번호"
              placeholderTextColor={colors.gray[70]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
            >
              {showPassword ? (
                <OpenEyes width={20} height={20} />
              ) : (
                <CloseEyes width={20} height={20} />
              )}
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.input,
              styles.passwordRow,
              { marginTop: 8 },
              errors.passwordConfirm ? styles.inputError : null,
            ]}
          >
            <TextInput
              style={styles.passwordInput}
              placeholder="비밀번호 확인"
              placeholderTextColor={colors.gray[70]}
              value={passwordConfirm}
              onChangeText={(v) => {
                setPasswordConfirm(v);
                setErrors((prev) => ({ ...prev, passwordConfirm: "" }));
              }}
              secureTextEntry={!showPasswordConfirm}
            />
            <TouchableOpacity
              onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
              style={styles.eyeBtn}
            >
              {showPasswordConfirm ? (
                <OpenEyes width={20} height={20} />
              ) : (
                <CloseEyes width={20} height={20} />
              )}
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <View style={styles.errorRow}>
              <ErrorImg width={14} height={14} />
              <Text style={styles.errorText}>{errors.password}</Text>
            </View>
          ) : errors.passwordConfirm ? (
            <View style={styles.errorRow}>
              <ErrorImg width={14} height={14} />
              <Text style={styles.errorText}>{errors.passwordConfirm}</Text>
            </View>
          ) : (
            <Text style={styles.hintText}>
              6~20자/영문 대문자, 소문자, 숫자, 특수문자(!@#$%^&*) 중 2가지 이상 조합
            </Text>
          )}
        </View>

        {/* 이메일 */}
        <View style={styles.section}>
          <Text style={styles.label}>이메일</Text>
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
                showDomainPicker ? styles.domainPickerSelected : null,
                errors.email ? styles.inputError : null,
              ]}
              onPress={() => setShowDomainPicker((prev) => !prev)}
            >
              {isDomainDirect ? (
                <TextInput
                  style={styles.domainDirectInput}
                  placeholder="직접 입력"
                  placeholderTextColor={colors.gray[70]}
                  value={emailDomain}
                  onChangeText={setEmailDomain}
                  autoCapitalize="none"
                  // 드롭다운 열려있으면 텍스트 입력 막기
                  editable={!showDomainPicker}
                />
              ) : (
                <Text style={styles.domainText}>{emailDomain}</Text>
              )}
              <ArrowDown
                width={16}
                height={16}
                style={{
                  transform: [{ rotate: showDomainPicker ? "180deg" : "0deg" }],
                }}
              />
            </TouchableOpacity>
          </View>

          {/* 인라인 도메인 드롭다운 */}
          {showDomainPicker && (
            <View style={styles.domainDropdown}>
              {EMAIL_DOMAINS.map((domain) => (
                <Pressable
                  key={domain}
                  style={({ pressed }) => [
                    styles.domainItem,
                    pressed && { backgroundColor: "#00000008" },
                  ]}
                  onPress={() => {
                    setIsDomainDirect(false);
                    setEmailDomain(domain);
                    setShowDomainPicker(false);
                  }}
                >
                  <Text style={styles.domainItemText}>{domain}</Text>
                </Pressable>
              ))}
              <Pressable
                style={({ pressed }) => [
                  styles.domainItem,
                  pressed && { backgroundColor: "#00000008" },
                ]}
                onPress={() => {
                  setIsDomainDirect(true);
                  setEmailDomain("");
                  setShowDomainPicker(false);
                }}
              >
                <Text style={[styles.domainItemText, { color: colors.gray[50] }]}>직접 입력</Text>
              </Pressable>
            </View>
          )}

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
            {/* TODO: 이메일 인증 API 연동 후 onPress 연결 */}
            <TouchableOpacity
              style={styles.actionButton}
              disabled
              accessibilityState={{ disabled: true }}
            >
              <Text style={styles.actionButtonText}>인증번호 전송</Text>
            </TouchableOpacity>
          </View>

          {errors.email ? (
            <View style={styles.errorRow}>
              <ErrorImg width={14} height={14} />
              <Text style={styles.errorText}>{errors.email}</Text>
            </View>
          ) : null}
          {errors.verifyCode ? (
            <View style={styles.errorRow}>
              <ErrorImg width={14} height={14} />
              <Text style={styles.errorText}>인증 번호를 확인해주세요.</Text>
            </View>
          ) : null}
        </View>

        {/* 완료 버튼 */}
        <View style={styles.submitArea}>
          <TouchableOpacity
            style={styles.submitButton}
            disabled={isLoading}
            onPress={async () => {
              const usernameError = validateUsername(username);
              const passwordError = validatePassword(password);
              const passwordConfirmError = password !== passwordConfirm ? "비밀번호가 일치하지 않습니다." : "";
              const emailError = validateEmail(email, emailDomain);
              const verifyCodeError = verifyCode ? "" : "error";
              setErrors({
                username: usernameError,
                password: passwordError,
                passwordConfirm: passwordConfirmError,
                email: emailError,
                verifyCode: verifyCodeError,
              });

              if (usernameError || passwordError || passwordConfirmError || emailError || verifyCodeError) return;

              setIsLoading(true);
              try {
                await signUp({
                  username,
                  password,
                  passwordConfirmation: passwordConfirm,
                  email: `${email}@${emailDomain}`,
                });
                Alert.alert("회원가입 완료", "로그인 화면으로 이동합니다.", [
                  { text: "확인", onPress: () => router.replace("/login") },
                ]);
              } catch (e: any) {
                Alert.alert("회원가입 실패", e.message);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.gray[100]} />
            ) : (
              <Text
                style={[
                  styles.submitText,
                  { color: isFormValid ? colors.gray[100] : "#5C5C5C" },
                ]}
              >
                완료
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  section: {
    marginBottom: 40,
  },
  label: {
    fontFamily: fontFamily.pretendard.bold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray[50],
    marginBottom: 8,
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
    position: "relative",
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
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 16,
    color: colors.primary.black,
  },
  eyeBtn: {
    position: "absolute",
    right: 20,
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
  atSign: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 16,
    color: colors.gray[50],
  },
  hintText: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 12,
    lineHeight: 17,
    color: colors.gray[60],
    marginTop: 6,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  errorText: {
    fontFamily: fontFamily.pretendard.medium,
    fontSize: 12,
    lineHeight: 17,
    color: colors.system.error,
  },
  submitArea: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: colors.primary.black,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
  },
  submitText: {
    ...typography.body3,
  },
  domainDropdown: {
    position: "absolute",

    top: 59,

    right: 0,
    width: "48%",

    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingVertical: 8,

    shadowColor: colors.primary.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,

    elevation: 10,
    zIndex: 10,
  },
  domainItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
  domainItemText: {
    fontFamily: fontFamily.pretendard.regular,
    fontSize: 14,
    lineHeight: 14,
    color: colors.gray[40],
  },
});

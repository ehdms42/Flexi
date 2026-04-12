import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import { useRouter } from "expo-router";

import { colors } from "@constants/colors";
import { fontFamily, typography } from "@constants/typography";
import GoogleIcon from "../../assets/icons/google-icon.svg";
import OpenEyes from "../../assets/icons/open-eyes.svg";
import CloseEyes from "../../assets/icons/close-eyes.svg";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* 타이틀 */}
        <View style={styles.titleArea}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Text style={styles.titleOrange}>FLEXI</Text>
            <Text style={styles.titleBlack}>에</Text>
          </View>
          <Text style={styles.titleBlack}>오신 것을 환영합니다!</Text>
          <Text style={styles.subtitle}>
            로그인 후 일정을 안전하게 보호하세요.
          </Text>
        </View>

        {/* 인풋 영역 */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="아이디 입력"
            placeholderTextColor={colors.gray[70]}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={styles.divider} />
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="비밀번호 입력"
              placeholderTextColor={colors.gray[70]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <OpenEyes width={20} height={20} />
              ) : (
                <CloseEyes width={20} height={20} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* 로그인 버튼 */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>

        {/* 링크들 */}
        <View style={styles.linkRow}>
          <TouchableOpacity>
            <Text style={styles.linkText}>아이디 찾기</Text>
          </TouchableOpacity>
          <Text style={styles.linkDivider}>|</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>비밀번호 찾기</Text>
          </TouchableOpacity>
          <Text style={styles.linkDivider}>|</Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.linkText}>회원가입</Text>
          </TouchableOpacity>
        </View>

        {/* 또는 구분선 */}
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>또는</Text>
          <View style={styles.orLine} />
        </View>

        {/* 구글 로그인 */}
        <TouchableOpacity style={styles.googleButton}>
          <GoogleIcon width={24} height={24} />
          <Text style={styles.googleText}>구글로 로그인</Text>
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
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    paddingBottom: 60,
  },
  titleArea: {
    marginBottom: 40,
  },
  titleOrange: {
    ...typography.display4,
    fontFamily: fontFamily.urbanist.bold,
    color: colors.primary.default,
    lineHeight: 37,
  },
  titleBlack: {
    ...typography.display4,
    color: colors.primary.black,
    lineHeight: 37,
  },
  subtitle: {
    ...typography.body9,
    color: colors.gray[50],
    marginTop: 12,
    lineHeight: 20,
  },
  inputCard: {
    backgroundColor: colors.gray[100],
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontFamily: fontFamily.pretendard.regular,
    fontSize: 14,
    color: colors.primary.black,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[90],
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontFamily: fontFamily.pretendard.regular,
    fontSize: 14,
    color: colors.primary.black,
  },
  eyeButton: {
    paddingRight: 20,
    paddingVertical: 18,
  },
  loginButton: {
    backgroundColor: colors.primary.black,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonText: {
    ...typography.body3,
    fontFamily: fontFamily.pretendard.bold,
    color: colors.gray[100],
    lineHeight: 23,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 30,
  },
  linkText: {
    ...typography.label2,
    color: colors.gray[40],
    lineHeight: 17,
  },
  linkDivider: {
    color: colors.gray[80],
    fontSize: 12,
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 30,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[80],
  },
  orText: {
    ...typography.label2,
    color: colors.gray[50],
    lineHeight: 17,
  },
  googleButton: {
    backgroundColor: colors.gray[100],
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
  },
  googleText: {
    ...typography.body5,
    color: colors.primary.black,
    lineHeight: 23,
    flex: 1,
    textAlign: "center",
    marginRight: 24,
  },
});

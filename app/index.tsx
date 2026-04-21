import { useEffect } from "react";

import { useRouter } from "expo-router";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { View, Dimensions } from "react-native";

import Logo from "@assets/icons/logo.svg";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  const translateX = useSharedValue(-width);
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const goToNext = () => {
    // TODO: Sprint 2 - 토큰 유무에 따라 홈(/) 또는 로그인(/login)으로 분기
    router.replace("/login");
  };

  useEffect(() => {
    translateX.value = withTiming(0, {
      duration: 2000,
      easing: Easing.out(Easing.exp),
    });
    rotate.value = withTiming(
      360,
      {
        duration: 2000,
        easing: Easing.out(Easing.exp),
      },
      (finished) => {
        if (finished) runOnJS(goToNext)();
      }
    );

    return () => {
      cancelAnimation(translateX);
      cancelAnimation(rotate);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F5F3F1",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View style={animatedStyle}>
        <Logo width={120} height={120} />
      </Animated.View>
    </View>
  );
}

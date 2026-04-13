import { useEffect } from "react";

import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { View, Dimensions } from "react-native";

import Logo from "../assets/icons/logo.svg";

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

  const goToNext = async () => {
    // const token = await SecureStore.getItemAsync('accessToken');
    // if (token) {
    //   router.replace('/(app)');
    // } else {
    //   router.replace('/(auth)/login');
    // }
    router.replace("/(app)");
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
      () => {
        runOnJS(goToNext)();
      }
    );
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

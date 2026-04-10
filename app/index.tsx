import { useEffect } from "react";

import { useRouter } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { View, Image, Dimensions } from "react-native";

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

  const goToHome = () => {
    router.replace("/(app)");
  };

  useEffect(() => {
    translateX.value = withTiming(0, {
      duration: 1500,
      easing: Easing.out(Easing.exp),
    });
    rotate.value = withTiming(
      360,
      {
        duration: 2000,
        easing: Easing.out(Easing.exp),
      },
      () => {
        runOnJS(goToHome)();
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
        <Image
          source={require("../assets/icons/icon.png")}
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

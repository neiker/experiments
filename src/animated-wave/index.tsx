import React from "react";
import { View, StyleSheet } from "react-native";
import { Svg, Path, LinearGradient, Stop } from "react-native-svg";
import Animated, { Value, useCode, Easing, set } from "react-native-reanimated";
import { interpolatePath, loop } from "react-native-redash";

const styles = StyleSheet.create({
  container: { flex: 1 },
  svg: { position: "absolute", left: 0, right: 0, bottom: 0, height: 160 },
});

const AnimatedPath = Animated.createAnimatedComponent(Path);

function useAnimatedWave() {
  const progress = new Value(0);
  const d = interpolatePath(progress, {
    inputRange: [0, 0.5, 1],
    outputRange: [
      "M0,224L48,229.3C96,235,192,245,288,218.7C384,192,480,128,576,106.7C672,85,768,107,864,117.3C960,128,1056,128,1152,117.3C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
      "M0,64L48,74.7C96,85,192,107,288,117.3C384,128,480,128,576,112C672,96,768,64,864,48C960,32,1056,32,1152,48C1248,64,1344,96,1392,112L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
      "M0,160L48,186.7C96,213,192,267,288,266.7C384,267,480,213,576,186.7C672,160,768,160,864,160C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
    ],
  });

  useCode(() => {
    return [
      set(
        progress,
        loop({
          duration: 10000,
          easing: Easing.inOut(Easing.quad),
          boomerang: true,
        })
      ),
    ];
  }, []);

  return d;
}

export const AnimatedWave = () => {
  const d = useAnimatedWave();

  return (
    <View style={styles.container}>
      <View style={styles.svg}>
        <Svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <LinearGradient id="grad1" x1="50%" y1="0%" x2="100%" y2="100%">
            <Stop offset="5%" stopColor="#09f" />
            <Stop offset="95%" stopColor="#07c" />
          </LinearGradient>
          <AnimatedPath fill="url(#grad1)" fillOpacity="1" d={d} />
        </Svg>
      </View>
    </View>
  );
};

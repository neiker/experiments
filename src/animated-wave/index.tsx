import React from "react";
import { View, StyleSheet } from "react-native";
import { Svg, Path } from "react-native-svg";
import Animated, { Value, useCode, Easing, set } from "react-native-reanimated";
import { interpolatePath, loop } from "react-native-redash";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  svgTop: { position: "absolute", left: 0, right: 0, top: 0, height: 160 },
  svgBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
  },
});

const AnimatedPath = Animated.createAnimatedComponent(Path);

function useAnimatedWave(paths: string[]) {
  const progress = new Value(0);
  const d = interpolatePath(progress, {
    inputRange: paths.map((_, index) => index / (paths.length - 1)),
    outputRange: paths,
  });

  useCode(() => {
    return [
      set(
        progress,
        loop({
          duration: 4000,
          easing: Easing.inOut(Easing.linear),
          boomerang: true,
        })
      ),
    ];
  }, []);

  return d;
}

const AnimatedWave: React.FC<{ paths: string[] }> = ({ paths }) => {
  const d = useAnimatedWave(paths);

  return (
    <Svg viewBox="0 0 500 150" preserveAspectRatio="none">
      <AnimatedPath fill="#2089dc" fillOpacity="1" d={d} />
    </Svg>
  );
};

export const AnimatedWaveScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.svgTop}>
        <AnimatedWave
          paths={[
            `M0,50 

            C150,20 
                270,120
                500,50 

            L500,0 
            L0,0 Z`,
            `M0,50 

            C150,150 
                271,0 
                500,50 

            L500,0 
            L0,0 Z`,
          ]}
        />
      </View>
      <View style={styles.svgBottom}>
        <AnimatedWave
          paths={[
            `M0,70 
            C110,150 
                400,15 
                500,0 
            L500,150
            L0,150 Z
            `,

            `M0,0 
            C230,12 
                300,107 
                501,98 
            L500,150 
            L0,150 Z`,
          ]}
        />
      </View>
    </View>
  );
};

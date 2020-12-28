import React from "react";
import { View, StyleSheet } from "react-native";
import { Svg, Path } from "react-native-svg";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import * as redash from "react-native-redash";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  svgTop: { position: "absolute", left: 0, right: 0, top: 0, height: 160 },
  svgBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
    transform: [
      {
        rotate: "180deg",
      },
    ],
  },
});

const AnimatedPath = Animated.createAnimatedComponent(Path);

const AnimatedWave: React.FC<{ paths: string[] }> = ({ paths }) => {
  const progress = useSharedValue(0);
  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 5000,
        easing: Easing.inOut(Easing.linear),
      }),
      -1, // Infinite
      true // Boomerang
    );
  }, [progress]);

  // parse function cannot run on the UI thread.
  const pathsParsed = paths.map(redash.parse);

  const animatedProps = useAnimatedProps(() => {
    const d = redash.interpolatePath(
      progress.value,
      paths.map((_, index) => index / (paths.length - 1)),
      pathsParsed
    );

    return {
      d,
    };
  });

  return (
    <Svg viewBox="0 0 500 150" preserveAspectRatio="none">
      <AnimatedPath
        fill="#2089dc"
        fillOpacity="1"
        animatedProps={animatedProps}
      />
    </Svg>
  );
};

const paths = [
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
];

export const AnimatedWaveScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.svgTop}>
        <AnimatedWave paths={paths} />
      </View>
      <View style={styles.svgBottom}>
        <AnimatedWave paths={paths} />
      </View>
    </View>
  );
};

import React from "react";
import { View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Reanimated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  Easing,
  useDerivedValue,
} from "react-native-reanimated";
import { ReText, useVector, clamp } from "react-native-redash";

import { useScreenAvailableSize } from "./utils/useScreenAvailableSize";

const BOX_SIZE = 120;

function withEaseInCubic(toValue: number) {
  "worklet";

  return withTiming(toValue, {
    easing: Easing.bezier(0.5, 0.2, 1, 0.2),
  });
}

export function MagnetScreen() {
  const screenSize = useScreenAvailableSize();

  const position = useVector(0, 0);

  const boxStyle = useAnimatedStyle(() => {
    return {
      width: BOX_SIZE,
      height: BOX_SIZE,
      backgroundColor: "#ff569a",
      transform: [
        { translateX: position.x.value },
        { translateY: position.y.value },
      ],
    };
  });

  const maxX = screenSize.width - BOX_SIZE;
  const maxY = screenSize.height - BOX_SIZE;

  const panHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetX: number; offsetY: number }
  >({
    onStart: (_, context) => {
      context.offsetX = position.x.value;
      context.offsetY = position.y.value;
    },
    onActive: (event, context) => {
      position.x.value = clamp(context.offsetX + event.translationX, 0, maxX);
      position.y.value = clamp(context.offsetY + event.translationY, 0, maxY);
    },
    onEnd: () => {
      if (position.x.value - BOX_SIZE < 0) {
        position.x.value = withEaseInCubic(0);
      } else if (position.x.value + BOX_SIZE > maxX) {
        position.x.value = withEaseInCubic(maxX);
      }

      if (position.y.value < BOX_SIZE) {
        position.y.value = withEaseInCubic(0);
      } else if (position.y.value > maxY - BOX_SIZE) {
        position.y.value = withEaseInCubic(maxY);
      }
    },
  });

  const coordinates = useDerivedValue(
    () => `${Math.round(position.x.value)}:${Math.round(position.y.value)}`
  );

  return (
    <View
      style={{
        backgroundColor: "#effccb",
        width: screenSize.width,
        height: screenSize.height,
      }}
    >
      <PanGestureHandler onGestureEvent={panHandler}>
        <Reanimated.View
          style={[boxStyle, { alignItems: "center", justifyContent: "center" }]}
        >
          <ReText
            text={coordinates}
            style={{ color: "#222", fontVariant: ["tabular-nums"] }}
          />
        </Reanimated.View>
      </PanGestureHandler>
    </View>
  );
}

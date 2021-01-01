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
  useSharedValue,
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

  const maxX = screenSize.width - BOX_SIZE;
  const maxY = screenSize.height - BOX_SIZE;
  const proximity = BOX_SIZE;

  const position = useVector(maxX / 2, maxY / 2);
  const stickLeft = useSharedValue(false);
  const stickTop = useSharedValue(false);
  const stickRight = useSharedValue(false);
  const stickBottom = useSharedValue(false);

  const boxStyle = useAnimatedStyle(() => {
    return {
      width: BOX_SIZE,
      height: BOX_SIZE,
      backgroundColor: "white",
      transform: [
        { translateX: position.x.value },
        { translateY: position.y.value },
      ],
      borderWidth: 2,
      borderLeftColor: stickLeft.value ? "red" : "transparent",
      borderTopColor: stickTop.value ? "red" : "transparent",
      borderRightColor: stickRight.value ? "red" : "transparent",
      borderBottomColor: stickBottom.value ? "red" : "transparent",
    };
  });

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

      stickLeft.value = position.x.value < proximity;
      stickRight.value = position.x.value > maxX - proximity;

      stickTop.value = position.y.value < proximity;
      stickBottom.value = position.y.value > maxY - proximity;
    },
    onEnd: () => {
      if (stickLeft.value) {
        position.x.value = withEaseInCubic(0);
      } else if (stickRight.value) {
        position.x.value = withEaseInCubic(maxX);
      }

      if (stickTop.value) {
        position.y.value = withEaseInCubic(0);
      } else if (stickBottom.value) {
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
        backgroundColor: "gray",
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
            style={{ color: "gray", fontVariant: ["tabular-nums"] }}
          />
        </Reanimated.View>
      </PanGestureHandler>
    </View>
  );
}

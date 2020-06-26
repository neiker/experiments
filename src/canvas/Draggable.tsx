import React from "react";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import {
  usePanGestureHandler,
  withOffset,
  diffClamp,
} from "react-native-redash";
import Reanimated, {
  Value,
  sub,
  useCode,
  cond,
  eq,
  call,
} from "react-native-reanimated";
import { Dimensions, StyleSheet } from "react-native";

const windowSize = Dimensions.get("window");

const styles = StyleSheet.create({
  widgetPosition: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export const Draggable: React.FC<{
  x: Value<number>;
  y: Value<number>;
  width: Value<number>;
  height: Value<number>;
  onDragEnd: (position: { x: number; y: number }) => void;
}> = ({ children, x, y, width, height, onDragEnd }) => {
  const panGesture = usePanGestureHandler();

  const translateX = diffClamp(
    withOffset(panGesture.translation.x, panGesture.state, x),
    0,
    sub(windowSize.width, width)
  );

  const translateY = diffClamp(
    withOffset(panGesture.translation.y, panGesture.state, y),
    0,
    sub(windowSize.height, height)
  );

  const onEnd = React.useCallback(
    (position: readonly number[]) => {
      onDragEnd({ x: position[0], y: position[1] });
    },
    [onDragEnd]
  );

  useCode(
    () => [
      cond(eq(panGesture.state, State.END), [
        call([translateX, translateY], onEnd),
      ]),
    ],
    []
  );

  return (
    <PanGestureHandler {...panGesture.gestureHandler}>
      <Reanimated.View
        style={[
          styles.widgetPosition,
          {
            opacity: panGesture.state.interpolate({
              inputRange: [State.UNDETERMINED, State.ACTIVE, State.END],
              outputRange: [1, 0.5, 1],
            }),
            transform: [{ translateX }, { translateY }],
          },
        ]}
      >
        {children}
      </Reanimated.View>
    </PanGestureHandler>
  );
};

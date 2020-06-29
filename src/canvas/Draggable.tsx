import React from "react";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import {
  usePanGestureHandler,
  diffClamp,
  Vector,
  useVector,
} from "react-native-redash";
import Reanimated, {
  sub,
  useCode,
  cond,
  eq,
  call,
  set,
  add,
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
  position: Vector<Reanimated.Value<number>>;
  size: Vector<Reanimated.Value<number>>;

  onDragEnd: (position: { x: number; y: number }) => void;
}> = ({ children, position, size, onDragEnd }) => {
  const panGesture = usePanGestureHandler();

  const onEnd = React.useCallback(
    (newPosition: readonly number[]) => {
      onDragEnd({ x: newPosition[0], y: newPosition[1] });
    },
    [onDragEnd]
  );

  const offset = useVector(0, 0);

  useCode(
    () => [
      cond(eq(panGesture.state, State.BEGAN), [
        set(offset.x, position.x),
        set(offset.y, position.y),
      ]),
      cond(eq(panGesture.state, State.ACTIVE), [
        set(
          position.x,
          diffClamp(
            add(panGesture.translation.x, offset.x),
            0,
            sub(windowSize.width, size.x)
          )
        ),
        set(
          position.y,
          diffClamp(
            add(panGesture.translation.y, offset.y),
            0,
            sub(windowSize.height - 62, size.y)
          )
        ),
      ]),
      cond(eq(panGesture.state, State.END), [
        call([position.x, position.y], onEnd),
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
            transform: [{ translateX: position.x }, { translateY: position.y }],
          },
        ]}
      >
        {children}
      </Reanimated.View>
    </PanGestureHandler>
  );
};

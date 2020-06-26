import React from "react";
import {
  PanGestureHandler,
  State,
  LongPressGestureHandler,
} from "react-native-gesture-handler";
import Animated, { cond, eq, useCode, set, and } from "react-native-reanimated";
import {
  usePanGestureHandler,
  useTapGestureHandler,
  useVector,
} from "react-native-redash";

export interface Box {
  id: number;
  color: string;
}

export const Item: React.FC<{ data: Box }> = ({ data }) => {
  const panGesture = usePanGestureHandler();
  const longPressGesture = useTapGestureHandler();

  const translate = useVector(0, 0);

  const zIndex = cond(eq(longPressGesture.state, State.ACTIVE), 2, 1);
  const scale = cond(eq(longPressGesture.state, State.ACTIVE), 1.02, 1);
  const rotateZ = cond(eq(longPressGesture.state, State.ACTIVE), 0.03, 0);

  useCode(
    () => [
      cond(
        and(
          eq(panGesture.state, State.ACTIVE),
          eq(longPressGesture.state, State.ACTIVE)
        ),
        [
          set(translate.x, panGesture.translation.x),
          set(translate.y, panGesture.translation.y),
        ],
        [set(translate.x, 0), set(translate.y, 0)]
      ),
    ],
    []
  );

  const panRef = React.useRef<any>();
  const tapRef = React.useRef<any>();

  return (
    <LongPressGestureHandler
      {...longPressGesture.gestureHandler}
      minDurationMs={250}
      simultaneousHandlers={panRef}
      ref={tapRef}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(1,1,1,0.05)",
          height: 80,
          marginHorizontal: 10,
          marginVertical: 10,
          zIndex,
        }}
      >
        <PanGestureHandler
          {...panGesture.gestureHandler}
          minDist={20}
          simultaneousHandlers={tapRef}
          ref={panRef}
        >
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: data.color || "#fff",
              borderWidth: 1,
              borderColor: "#999",
              transform: [
                { translateY: translate.y },
                { translateX: translate.x },
                { scale },
                { rotateZ },
              ],
            }}
          />
        </PanGestureHandler>
      </Animated.View>
    </LongPressGestureHandler>
  );
};

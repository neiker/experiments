import React from "react";
import { View } from "react-native";
import {
  ScrollView,
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
import randomColor from "random-color";

interface Box {
  id: number;
  color: string;
}
const items: Box[] = Array.from(new Array(10)).map((_, i) => ({
  id: i,
  color: randomColor(),
}));

const Item: React.FC<{ data: Box }> = ({ data }) => {
  const panGesture = usePanGestureHandler();
  const tapGesture = useTapGestureHandler();

  const translate = useVector(0, 0);

  const zIndex = cond(eq(tapGesture.state, State.ACTIVE), 2, 1);
  const scale = cond(eq(tapGesture.state, State.ACTIVE), 1.02, 1);
  const rotateZ = cond(eq(tapGesture.state, State.ACTIVE), 0.03, 0);

  useCode(
    () => [
      cond(
        and(
          eq(panGesture.state, State.ACTIVE),
          eq(tapGesture.state, State.ACTIVE)
        ),
        [
          set(translate.x, panGesture.translation.x),
          set(translate.y, panGesture.translation.y),
        ]
      ),
      cond(eq(panGesture.state, State.END), [
        set(translate.x, 0),
        set(translate.y, 0),
      ]),
    ],
    []
  );

  const panRef = React.useRef<any>();
  const tapRef = React.useRef<any>();

  return (
    <LongPressGestureHandler
      {...tapGesture.gestureHandler}
      minDurationMs={250}
      simultaneousHandlers={panRef}
      ref={tapRef}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.1)",
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
              backgroundColor: data.color,
              borderWidth: 1,
              borderColor: "#777",
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

export const List: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <ScrollView>
        {items.map((item) => (
          <Item key={item.id} data={item} />
        ))}
      </ScrollView>
    </View>
  );
};

import React from "react";
import Reanimated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  NativeViewGestureHandler,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Divider } from "react-native-elements";
import faker from "faker";
import { FlatList, Platform } from "react-native";
import { clamp } from "react-native-redash";

import { Stories, STORIES_HEIGHT } from "./Stories";
import { Header, HEADER_HEIGHT } from "./Header";
import { colors } from "./colors";
import { Tweet, TweetData } from "./Tweet";

const TWEETS: TweetData[] = [...Array(40)].map((_, id) => ({
  id,
  author: {
    name: faker.name.findName(),
    username: faker.internet.userName(),
    avatarUrl: faker.image.imageUrl(50, 50, "people", true, true),
  },
  content: faker.lorem.sentence(faker.random.number(30)),
  comments: faker.random.number(10),
  retweets: faker.random.number(50),
  likes: faker.random.number(300),
}));

export const TwitterHeaderScreen = () => {
  const insets = useSafeAreaInsets();

  const listRef = React.useRef<NativeViewGestureHandler>(null);
  const panRef = React.useRef<PanGestureHandler>(null);

  const topHeight = STORIES_HEIGHT + HEADER_HEIGHT + insets.top;

  const y = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startY = y.value;
    },
    onActive: (event, ctx) => {
      // TODO diffClamp
      y.value = clamp(ctx.startY + event.translationY, -topHeight, 0);
    },
    onEnd: () => {
      // TODO add withDecay for a nice deceleration
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: y.value }],
    };
  });

  const listWrapperStyle = useAnimatedStyle(() => {
    // The header and stories are absolutely positioned so the
    // list needs a paddingTop to compensate it.
    // This should be done outise scrollable to keep consitency on scrollbar
    return { paddingTop: topHeight + y.value };
  });

  const cancelScrollViewStyle = useAnimatedStyle(() => {
    // on iOS we cancel the translation on the scroll while header is hiding
    if (Platform.OS === "ios") {
      return {
        height: Math.max(-y.value, 0),
      };
    }

    return { height: 0 };
  });

  return (
    <PanGestureHandler
      ref={panRef}
      simultaneousHandlers={listRef}
      onGestureEvent={gestureHandler}
    >
      <Reanimated.View style={{ backgroundColor: colors.white }}>
        <Reanimated.View
          style={[
            headerAnimatedStyle,
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 2,
            },
          ]}
        >
          <Header />

          <Stories />
        </Reanimated.View>

        <Reanimated.View style={listWrapperStyle}>
          <NativeViewGestureHandler ref={listRef} simultaneousHandlers={panRef}>
            <FlatList
              snapToInterval={1}
              ListHeaderComponent={() => (
                <Reanimated.View style={cancelScrollViewStyle} />
              )}
              contentContainerStyle={{ paddingBottom: insets.bottom }}
              ItemSeparatorComponent={() => (
                <Divider style={{ backgroundColor: colors.exlightGray }} />
              )}
              keyExtractor={(_, index) => index.toString()}
              data={TWEETS}
              renderItem={({ item }) => {
                return <Tweet item={item} />;
              }}
              bounces={false}
              decelerationRate={0.9}
            />
          </NativeViewGestureHandler>
        </Reanimated.View>
      </Reanimated.View>
    </PanGestureHandler>
  );
};

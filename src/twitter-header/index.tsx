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

  const headerHeightWithInset = HEADER_HEIGHT + insets.top;
  const topHeight = STORIES_HEIGHT + headerHeightWithInset;

  const headerTranslateY = useSharedValue(0);
  const storiesTranslateY = useSharedValue(0);

  // Why use a pan gesture instead of onScroll event?
  // Because we are translating the ScrollView and
  // it will give us false movements because of this.
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { prevY: number }
  >({
    onStart: (_, ctx) => {
      ctx.prevY = 0;
    },
    onActive: (event, ctx) => {
      const diff = event.translationY - ctx.prevY;

      headerTranslateY.value = clamp(
        headerTranslateY.value + diff,
        -headerHeightWithInset,
        0
      );
      storiesTranslateY.value = clamp(
        storiesTranslateY.value + diff,
        -topHeight,
        0
      );

      ctx.prevY = event.translationY;
    },
    onEnd: () => {
      // TODO add withDecay for a nice deceleration
    },
  });

  const listWrapperStyle = useAnimatedStyle(() => {
    // The header and stories are absolutely positioned so the
    // list needs a paddingTop to compensate it.
    // This should be done outise scrollable to keep consitency on scrollbar
    return {
      marginTop: topHeight + headerTranslateY.value + storiesTranslateY.value,
    };
  });

  const cancelScrollViewStyle = useAnimatedStyle(() => {
    // on iOS we cancel the translation on the scroll while header is hiding
    if (Platform.OS === "ios") {
      return {
        height: Math.abs(storiesTranslateY.value + headerTranslateY.value),
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
        <Header translateY={headerTranslateY} />

        <Stories
          translateY={storiesTranslateY}
          offsetY={headerHeightWithInset}
        />

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
              keyExtractor={(item) => `${item.id}`}
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

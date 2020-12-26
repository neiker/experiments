import React, { useEffect } from "react";
import { createStackNavigator, useHeaderHeight } from "@react-navigation/stack";
import { FlatList, Dimensions, View, Platform } from "react-native";
import { ListItem } from "react-native-elements";
import {
  PanGestureHandler,
  NativeViewGestureHandler,
} from "react-native-gesture-handler";
import Animated, { divide } from "react-native-reanimated";
import {
  diffClamp,
  usePanGestureHandler,
  withOffset,
} from "react-native-redash";

import data from "./tweets.json";

type ScrollContext = {
  listRef?: React.RefObject<NativeViewGestureHandler>;
  panRef?: React.RefObject<PanGestureHandler>;
  translateY?: Animated.Node<number>;
  setHeaderHeight: (value: number) => void;
};
const ScrollContext = React.createContext<ScrollContext | undefined>(undefined);

type StackTypes = {
  List: undefined;
};
const Stack = createStackNavigator<StackTypes>();

interface TweetData {
  author: {
    name: string;
    avatarUrl: string;
  };
  content: string;
}

const keyExtractor = (_: TweetData, index: number) => index.toString();

const renderItem = ({ item }: { item: TweetData }) => (
  <ListItem
    title={item.author.name}
    subtitle={item.content}
    subtitleStyle={{ fontSize: 12 }}
    leftAvatar={{ source: { uri: item.author.avatarUrl } }}
    bottomDivider
  />
);

function useScrollContext() {
  const context = React.useContext(ScrollContext);

  if (!context) {
    throw new Error(
      "useScrollContext should be used inside a descendant of ScrollContext.Provider"
    );
  }

  return context;
}

const List: React.FC = () => {
  const { setHeaderHeight, panRef, listRef, translateY } = useScrollContext();

  const headerHeight = useHeaderHeight();

  useEffect(() => {
    setHeaderHeight(headerHeight);
  }, [headerHeight, setHeaderHeight]);

  return (
    <NativeViewGestureHandler ref={listRef} simultaneousHandlers={panRef}>
      <FlatList
        ListHeaderComponent={() =>
          // on iOS we cancel the translation on the scroll while header is hiding
          Platform.OS === "ios" && translateY !== undefined ? (
            <Animated.View style={{ height: divide(translateY, -1) }} />
          ) : null
        }
        keyExtractor={keyExtractor}
        data={data}
        renderItem={renderItem}
        bounces={false}
      />
    </NativeViewGestureHandler>
  );
};

const windowHeight = Dimensions.get("window").height;

// First child of Context.Provider should be memoized
const Navigator = React.memo(() => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#15202b",
      },
      headerTintColor: "#fafafa",
      headerBackTitleVisible: false,
    }}
  >
    <Stack.Screen name="List" component={List} />
  </Stack.Navigator>
));

export const TwitterHeader = () => {
  const [headerHeight, setHeaderHeight] = React.useState(0);

  const listRef = React.useRef<NativeViewGestureHandler>(null);
  const panRef = React.useRef<PanGestureHandler>(null);

  const { gestureHandler, state, translation } = usePanGestureHandler();

  const height = headerHeight + windowHeight;

  const y = withOffset(translation.y, state);

  const translateY = diffClamp(y, -headerHeight, 0);

  return (
    <PanGestureHandler
      ref={panRef}
      simultaneousHandlers={listRef}
      {...gestureHandler}
    >
      <Animated.View
        style={{
          flex: 1,
          height,
          transform: [{ translateY }],
        }}
      >
        <View style={{ height }}>
          <ScrollContext.Provider
            value={{
              setHeaderHeight,
              listRef,
              panRef,
              translateY,
            }}
          >
            <Navigator />
          </ScrollContext.Provider>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

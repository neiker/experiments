import React, { useEffect } from "react";
import { createStackNavigator, useHeaderHeight } from "@react-navigation/stack";
import { ListItem } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import Animated, { divide, event } from "react-native-reanimated";
import { diffClamp, useValue } from "react-native-redash";
import { Dimensions, View } from "react-native";
import { RouteProp } from "@react-navigation/native";

type StackTypes = {
  List: {
    y: Animated.Value<number>;
    setHeaderHeight: (value: number) => void;
  };
};
const Stack = createStackNavigator<StackTypes>();

interface TweetData {
  author: {
    name: string;
    avatarUrl: string;
  };
  content: string;
}

const data: TweetData[] = require("./tweets.json");

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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

const List: React.FC<{
  route: RouteProp<StackTypes, "List">;
}> = ({ route }) => {
  const { y, setHeaderHeight } = route.params;
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    setHeaderHeight(headerHeight);
  }, [headerHeight, setHeaderHeight]);

  // We cancel the translation on the scroll while header is hiding
  const translateY = diffClamp(y, 0, headerHeight);

  return (
    <AnimatedFlatList
      onScroll={event([
        {
          nativeEvent: {
            contentOffset: { y },
          },
        },
      ])}
      scrollEventThrottle={1}
      ListHeaderComponent={() => (
        <Animated.View style={{ height: translateY }} />
      )}
      keyExtractor={keyExtractor}
      data={data}
      renderItem={renderItem}
      bounces={false}
    />
  );
};

const windowHeight = Dimensions.get("window").height;

export const TwitterHeader = () => {
  const [headerHeight, setHeaderHeight] = React.useState(0);

  const height = headerHeight + windowHeight;

  const y = useValue(0);

  const translateY = divide(diffClamp(y, 0, headerHeight), -1);

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ translateY }],
      }}
    >
      <View style={{ height }}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "#15202b",
            },
            headerTintColor: "#fafafa",
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen
            name="List"
            component={List}
            initialParams={{ y, setHeaderHeight }}
          />
        </Stack.Navigator>
      </View>
    </Animated.View>
  );
};

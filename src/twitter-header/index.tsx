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
    avatar_url: string;
  };
  content: string;
}

const list: TweetData[] = [
  {
    author: {
      name: "Amy Farha",
      avatar_url:
        "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
    },
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ligula neque, placerat vel purus ut, efficitur pulvinar velit. Nullam aliquam. ",
  },
  {
    author: {
      name: "Chris Jackson",
      avatar_url:
        "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
    },
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras feugiat ut odio sit amet eleifend. Sed vel luctus felis, id vulputate laoreet. ",
  },
];

const data = [
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
  ...list,
];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const keyExtractor = (_: TweetData, index: number) => index.toString();
const renderItem = ({ item }: { item: TweetData }) => (
  <ListItem
    title={item.author.name}
    subtitle={item.content}
    subtitleStyle={{ fontSize: 12 }}
    leftAvatar={{ source: { uri: item.author.avatar_url } }}
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

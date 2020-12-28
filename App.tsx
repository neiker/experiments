import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { ListItem } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";

import { List } from "./src/list";
import { Canvas } from "./src/canvas";
import { TwitterHeader } from "./src/twitter-header";
import { AnimatedWaveScreen } from "./src/animated-wave";

const Stack = createStackNavigator();

type Screen = {
  name: string;
  component: React.FC;
  title: string;
  screenOptions?: StackNavigationOptions;
};

const screens: Screen[] = [
  { name: "List ", component: List, title: "Sorted list" },
  {
    name: "Canvas ",
    component: Canvas,
    title: "Draggable stickies",
    screenOptions: {
      gestureEnabled: false,
    },
  },
  {
    name: "TwitterHeader ",
    component: TwitterHeader,
    title: "Twitter Header",
    screenOptions: {
      headerShown: false,
    },
  },
  {
    name: "AnimatedWave ",
    component: AnimatedWaveScreen,
    title: "Animated Wave",
  },
];

function HomeScreen() {
  const { navigate } = useNavigation();

  const renderItem = ({ item }: { item: Screen }) => (
    <ListItem
      onPress={() => {
        navigate(item.name);
      }}
      bottomDivider
    >
      <ListItem.Content>
        <ListItem.Title>{item.title}</ListItem.Title>
      </ListItem.Content>

      <ListItem.Chevron />
    </ListItem>
  );
  const keyExtractor = (_: Screen, index: number) => index.toString();

  return <FlatList {...{ renderItem, data: screens, keyExtractor }} />;
}

const App = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" />
    <Stack.Navigator
      headerMode="screen"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#2089dc",
          shadowRadius: 0,
          shadowOffset: {
            height: 0,
            width: 0,
          },
          elevation: 0,
        },
        headerTintColor: "#fafafa",
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Experiments",
        }}
      />

      {screens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            ...screen.screenOptions,
            title: screen.title,
          }}
        />
      ))}
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;

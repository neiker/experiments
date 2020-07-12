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
import { AnimatedWave } from "./src/animated-wave";

const Stack = createStackNavigator();

type Screen = {
  name: string;
  component: React.FC;
  title: string;
  screenOptions?: StackNavigationOptions;
};

const screens: Screen[] = [
  { name: "List ", component: List, title: "Sorted list" },
  { name: "Canvas ", component: Canvas, title: "Draggable stickies" },
  {
    name: "TwitterHeader ",
    component: TwitterHeader,
    title: "Twitter Header",
    screenOptions: {
      headerShown: false,
    },
  },
  { name: "AnimatedWave ", component: AnimatedWave, title: "Animated Wave" },
];

function HomeScreen() {
  const { navigate } = useNavigation();

  const renderItem = ({ item }: { item: Screen }) => (
    <ListItem
      title={item.title}
      onPress={() => {
        navigate(item.name);
      }}
      bottomDivider
      chevron
    />
  );
  const keyExtractor = (_: Screen, index: number) => index.toString();

  return <FlatList {...{ renderItem, data: screens, keyExtractor }} />;
}

const App = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" />
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#2089dc",
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

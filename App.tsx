import React from "react";
import { Button, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native-gesture-handler";

import { List } from "./src/list";
import { Canvas } from "./src/canvas";

const Stack = createStackNavigator();

const screens = [
  { name: "List ", component: List, title: "Sorted list" },
  { name: "Canvas ", component: Canvas, title: "Draggable stickies" },
];

function HomeScreen() {
  const { navigate } = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {screens.map((screen) => (
        <Button
          key={screen.name}
          onPress={() => {
            navigate(screen.name);
          }}
          title={screen.name}
        />
      ))}
    </View>
  );
}

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />

      {screens.map((screen) => (
        <Stack.Screen
          name={screen.name}
          component={screen.component}
          options={{
            title: screen.title,
          }}
        />
      ))}
      <Stack.Screen name="Canvas" component={Canvas} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;

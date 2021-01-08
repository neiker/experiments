import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { AlbumScreen } from "./screens/AlbumScreen";
import { AlbumsScreen } from "./screens/AlbumsScreen";
import { PhotoScreen } from "./screens/PhotoScreen";
import { PhotosStackProps } from "./types";

const Stack = createStackNavigator<PhotosStackProps>();

const queryClient = new QueryClient();

export function PhotosNavigator() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "black",
            // remove shadow on Android
            elevation: 0,
            // remove shadow on iOS
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            color: "white",
          },
          cardStyle: {
            backgroundColor: "black",
          },
        }}
      >
        <Stack.Screen name="Albums" component={AlbumsScreen} />
        <Stack.Screen
          name="Album"
          component={AlbumScreen}
          options={({ route }) => ({
            title: route.params.album.title,
          })}
        />
        <Stack.Screen
          name="Photo"
          component={PhotoScreen}
          options={({ route }) => ({
            title: route.params.photo.title,
          })}
        />
      </Stack.Navigator>
    </QueryClientProvider>
  );
}

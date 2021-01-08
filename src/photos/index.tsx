import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { QueryClient, QueryClientProvider } from "react-query";

import { AlbumScreen } from "./screens/AlbumScreen";
import { AlbumsScreen } from "./screens/AlbumsScreen";
import { PhotoScreen } from "./screens/PhotoScreen";
import { AlbumWithPhotos, Photo, PhotosStackProps } from "./types";

const Stack = createSharedElementStackNavigator<PhotosStackProps>();

const queryClient = new QueryClient();

export function PhotosNavigator() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack.Navigator
        mode="modal"
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
          sharedElementsConfig={(route, prevRoute) => {
            if (prevRoute.name === "Albums") {
              const album = route.params.album as AlbumWithPhotos;

              return album.photos
                .slice(0, 4)
                .map((photo) => `item.${photo.id}.photo`);
            }
          }}
        />
        <Stack.Screen
          name="Photo"
          component={PhotoScreen}
          options={({ route }) => ({
            title: route.params.photo.title,
          })}
          sharedElementsConfig={(route) => {
            const photo = route.params.photo as Photo;

            return [`item.${photo.id}.photo`];
          }}
        />
      </Stack.Navigator>
    </QueryClientProvider>
  );
}

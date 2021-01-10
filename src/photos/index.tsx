import {
  HeaderStyleInterpolators,
  TransitionSpecs,
} from "@react-navigation/stack";
import { TransitionPreset } from "@react-navigation/stack/lib/typescript/src/types";
import React from "react";
import { Icon } from "react-native-elements";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { QueryClient, QueryClientProvider } from "react-query";

import { AlbumScreen } from "./screens/AlbumScreen";
import { AlbumsScreen } from "./screens/AlbumsScreen";
import { PhotoScreen } from "./screens/PhotoScreen";
import { AlbumWithPhotos, PhotosStackProps } from "./types";

const Stack = createSharedElementStackNavigator<PhotosStackProps>();

// Use the same transition preset for all platforms
const fadeTransitionPreset: TransitionPreset = {
  gestureDirection: "horizontal",
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  // fade screen on show/hide
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }),
  headerStyleInterpolator: HeaderStyleInterpolators.forFade,
};

const queryClient = new QueryClient();

function StackHeaderBackIcon() {
  return (
    <Icon name="arrow-back" color="#eee" size={26} style={{ marginLeft: 5 }} />
  );
}

export function PhotosNavigator() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack.Navigator
        screenOptions={{
          ...fadeTransitionPreset,
          headerBackTitleVisible: false,
          headerBackImage: StackHeaderBackIcon,
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
          options={{
            title: "",
          }}
          sharedElementsConfig={(route, prevRoute, showing) => {
            // In order to perform the correct transition after scroll to a different photo
            // we call `navigation.setParams()` with the new focused photo id to get it on
            // `route.params.photoId`, but `react-navigation-shared-element` never updates it ¯\_(ツ)_/¯
            // So we only do the transition on showing:
            if (showing) {
              return [`item.${route.params.photoId}.photo`];
            }
          }}
        />
      </Stack.Navigator>
    </QueryClientProvider>
  );
}

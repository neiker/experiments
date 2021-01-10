import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, useWindowDimensions, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "react-query";

import { PhotosStackProps } from "../../types";
import { getAlbumsWithPhotos } from "../../api";

import { AlbumThumbnail } from "./AlbumThumbnail";

const NUM_COLUMNS = 2;

function VerticalSeparator() {
  return (
    <View
      style={{
        height: 2,
        backgroundColor: "#000",
      }}
    />
  );
}

interface AlbumsScreenProps {
  navigation: NavigationProp<PhotosStackProps, "Albums">;
}
export function AlbumsScreen({ navigation }: AlbumsScreenProps) {
  const insets = useSafeAreaInsets();
  const windowDimensions = useWindowDimensions();

  const { data: albums, status } = useQuery("albums", getAlbumsWithPhotos);

  if (status === "error") {
    // TODO handle errors
    return null;
  }

  if (status === "loading") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator color="white" size="large" />
      </View>
    );
  }

  return (
    <FlatList
      numColumns={NUM_COLUMNS}
      data={albums}
      renderItem={({ item: album, index }) => {
        const isEven = index % 2 === 0;

        return (
          <View
            style={
              isEven
                ? { borderRightColor: "#000", borderRightWidth: 1 }
                : { borderLeftColor: "#000", borderLeftWidth: 1 }
            }
          >
            <AlbumThumbnail
              size={windowDimensions.width / NUM_COLUMNS - 2}
              album={album}
              onPress={() => {
                navigation.navigate("Album", { album });
              }}
            />
          </View>
        );
      }}
      keyExtractor={(album) => `${album.id}`}
      contentContainerStyle={{
        paddingBottom: insets.bottom,
      }}
      ItemSeparatorComponent={VerticalSeparator}
    />
  );
}

import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, useWindowDimensions, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "react-query";

import { Album, AlbumWithPhotos, Photo, PhotosStackProps } from "../../types";

import { AlbumThumbnail } from "./AlbumThumbnail";

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (res.ok) {
    return res.json();
  }

  throw new Error();
}

async function fetchAlbumsWithPhotos(): Promise<AlbumWithPhotos[]> {
  const albums = await get<Album[]>(
    "https://jsonplaceholder.typicode.com/albums"
  );
  const photos = await get<Photo[]>(
    "https://jsonplaceholder.typicode.com/photos"
  );

  return albums.map((album) => ({
    ...album,
    photos: photos.filter((photo) => photo.albumId === album.id),
  }));
}

const NUM_COLUMNS = 2;

interface AlbumsScreenProps {
  navigation: NavigationProp<PhotosStackProps, "Albums">;
}
export function AlbumsScreen({ navigation }: AlbumsScreenProps) {
  const insets = useSafeAreaInsets();
  const windowDimensions = useWindowDimensions();

  const { data: albums, status } = useQuery("albums", fetchAlbumsWithPhotos);

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
      renderItem={({ item: album }) => (
        <AlbumThumbnail
          size={windowDimensions.width / NUM_COLUMNS}
          album={album}
          onPress={() => {
            navigation.navigate("Album", { album });
          }}
        />
      )}
      keyExtractor={(album) => `${album.id}`}
      contentContainerStyle={{
        paddingBottom: insets.bottom,
      }}
    />
  );
}

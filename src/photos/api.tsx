import AsyncStorage from "@react-native-async-storage/async-storage";

import { Album, AlbumWithPhotos, Photo } from "./types";

// This will cache the result of `fn` forever. Implement a expire mechanism if needed.
async function asyncMemo<T>(key: string, fn: () => Promise<T>) {
  const cachedValue = await AsyncStorage.getItem(key);

  if (cachedValue) {
    return JSON.parse(cachedValue);
  }

  const result = await fn();

  await AsyncStorage.setItem(key, JSON.stringify(result));

  return result;
}

export async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (res.ok) {
    return res.json();
  }

  throw new Error();
}

export async function getAlbumsWithPhotos(): Promise<AlbumWithPhotos[]> {
  const CACHE_KEY = "cache_for_albums_and_photos";

  return asyncMemo(CACHE_KEY, async () => {
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
  });
}

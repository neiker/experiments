import AsyncStorage from "@react-native-async-storage/async-storage";
import faker from "faker";

import { Album, AlbumWithPhotos, Photo } from "./types";

// This will cache the result of `fn` forever. Implement a expire mechanism if needed.
async function asyncMemo<T>(key: string, fn: () => Promise<T>) {
  const DEBUG = false;

  const cachedValue = await AsyncStorage.getItem(key);

  if (cachedValue && !DEBUG) {
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

// Generates a random number within a range
function generateRandomInteger(min: number, max: number) {
  return Math.floor(min + Math.random() * (max + 1 - min));
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

    return albums.map((album) => {
      let albumPhotos = photos.filter((photo) => photo.albumId === album.id);

      // All albums from jsonplaceholder have 50 images. Let's randomize it!
      albumPhotos.length = generateRandomInteger(10, albumPhotos.length);

      // Images from jsonplaceholder are squares with solid a solid color
      // So we use real photos:
      albumPhotos = albumPhotos.map((photo) => {
        // Use a 150x150 image to improve loading time
        // In a real scenario we will have 2 different sizes of the
        // same image but this is not posible with faker.js
        const url = faker.image.imageUrl(150, 150, undefined, true, true);

        return {
          ...photo,
          url: url,
          thumbnailUrl: url,
        };
      });

      return {
        ...album,
        photos: albumPhotos,
      };
    });
  });
}

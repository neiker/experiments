import AsyncStorage from "@react-native-async-storage/async-storage";
import faker from "faker";

// This will cache the result of `fn` forever. Implement a expire mechanism if needed.
async function asyncMemo<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const DEBUG = false;

  const cachedValue = await AsyncStorage.getItem(key);

  if (cachedValue && !DEBUG) {
    return JSON.parse(cachedValue);
  }

  const result = await fn();

  await AsyncStorage.setItem(key, JSON.stringify(result));

  return result;
}

export async function getAlbumsWithPhotos() {
  const CACHE_KEY = "cache:getAlbumsWithPhotos";

  return asyncMemo(CACHE_KEY, async () => {
    // The logic for transitions is easier with unique IDs for photos
    let photoId = 0;

    return [...Array(10)].map((_, albumId) => ({
      id: albumId,
      title: faker.lorem.sentence(faker.random.number({ min: 1, max: 5 })),
      photos: [...Array(faker.random.number({ min: 10, max: 40 }))].map(() => {
        // Use a 150x150 image to improve loading time
        // In a real scenario we will have 2 different sizes of the
        // same image but this is not posible with faker.js
        const url = faker.image.imageUrl(150, 150, undefined, true, true);

        return {
          id: photoId++,
          title: faker.lorem.sentence(faker.random.number({ min: 1, max: 5 })),
          url,
          thumbnailUrl: url,
        };
      }),
    }));
  });
}

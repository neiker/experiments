export interface Photo {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export interface Album {
  id: number;
  title: string;
  photos: Photo[];
}

export type PhotosStackProps = {
  Albums: undefined;
  Album: {
    album: Album;
  };
  Photo: {
    photos: Photo[];
    photoId: number;
  };
};

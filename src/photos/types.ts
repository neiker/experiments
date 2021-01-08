export interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export interface Album {
  userId: number;
  id: number;
  title: string;
}

export interface AlbumWithPhotos extends Album {
  photos: Photo[];
}

export type PhotosStackProps = {
  Albums: undefined;
  Album: {
    album: AlbumWithPhotos;
  };
  Photo: {
    photo: Photo;
  };
};

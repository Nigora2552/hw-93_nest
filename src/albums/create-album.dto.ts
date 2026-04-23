export class CreateAlbumDto {
  artist: string;
  title: string;
  year: number;
  isPublished: boolean;
}

export class SearchAlbumDto {
  artist?: string;
}

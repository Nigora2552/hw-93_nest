export class CreateTrackDto {
  album: string;
  title: string;
  duration: string;
  trackNumber: number;
  isPublished: boolean;
}

export class QueryTrack {
  album?: string;
}

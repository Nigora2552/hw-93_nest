import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from '../schemas/artist.schema';
import { Album, AlbumSchema } from '../schemas/album.schema';
import { Track, TrackSchema } from '../schemas/track.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/muzic-aplication-nest'),
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Track.name, schema: TrackSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [SeederService],
})
export class SeedModule {}

import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Artist } from './artist.schema';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({
    type: Types.ObjectId,
    ref: 'Artist',
    required: true,
  })
  artist: Artist | Types.ObjectId;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  year: number;
  @Prop({ default: false })
  isPublished: boolean;
  @Prop({ default: null })
  image: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);

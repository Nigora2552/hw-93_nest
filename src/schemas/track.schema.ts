import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Album } from './album.schema';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({
    type: Types.ObjectId,
    ref: 'Album',
    required: true,
  })
  album: Album | Types.ObjectId;
  @Prop({ required: true })
  title: string;
  @Prop({ default: null })
  duration: string;
  @Prop({
    default: 1,
    min: [1, 'Номер трека не может быть меньше 1'],
    type: Number,
  })
  trackNumber: number;
  @Prop({ default: false })
  isPublished: boolean;
}

export const TrackSchema = SchemaFactory.createForClass(Track);

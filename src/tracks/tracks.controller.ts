import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { Model } from 'mongoose';
import { CreateTrackDto, QueryTrack } from './create-track.dto';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { TokenAuthGuard } from '../token/token-auth.guard';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  async getAllOrByQuery(@Query() album: QueryTrack) {
    if (album) return this.trackModel.find(album);
    return this.trackModel.find();
  }
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.trackModel.findById(id);
  }
  @UseGuards(TokenAuthGuard)
  @Post()
  async create(@Body() trackDto: CreateTrackDto) {
    const albumExists = await this.albumModel.findById(trackDto.album);
    console.log(albumExists);
    if (!albumExists) {
      throw new NotFoundException(`Album with ID ${trackDto.album} not found`);
    }
    const trackCount = await this.trackModel.countDocuments({
      album: trackDto.album,
    });
    try {
      const newTrack = new this.trackModel({
        album: trackDto.album,
        title: trackDto.title,
        duration: trackDto.duration,
        trackNumber: trackCount + 1,
        isPublished: trackDto.isPublished,
      });
      return newTrack.save();
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
      throw new InternalServerErrorException(
        ' Ошибка при сохранении трэков в базу данных',
      );
    }
  }
  @SetMetadata('adminOnly', true)
  @UseGuards(TokenAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedTrack = await this.trackModel.findByIdAndDelete(id);

    if (!deletedTrack) {
      return { message: `Трэк с id ${id} не найден` };
    }

    return { message: ' Трэк был успешно удален' };
  }
}

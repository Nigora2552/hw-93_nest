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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Model } from 'mongoose';
import { CreateAlbumDto, SearchAlbumDto } from './create-album.dto';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}
  @Get()
  getAllOrByQuery(@Query() artist: SearchAlbumDto) {
    if (artist) {
      return this.albumModel.find(artist);
    } else {
      return this.albumModel.find();
    }
  }
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.albumModel.findById(id);
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads/albums',
        filename: (_req, file, callback) => {
          const uniqueSuffix = randomUUID();
          callback(null, `artist-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() albumData: CreateAlbumDto,
  ) {
    const artistExists = await this.artistModel.findById(albumData.artist);

    if (!artistExists) {
      throw new NotFoundException(
        `Artist with ID ${albumData.artist} not found`,
      );
    }

    try {
      const newAlbum = new this.albumModel({
        artist: albumData.artist,
        title: albumData.title,
        year: Number(albumData.year),
        isPublished: albumData.isPublished,
        image: file ? '/uploads/albums/' + file.filename : null,
      });
      return newAlbum.save();
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      throw new InternalServerErrorException(
        ' Ошибка при сохранении альбомов в базу данных',
      );
    }
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedAlbum = await this.albumModel.findByIdAndDelete(id);

    if (!deletedAlbum) {
      return { message: `Альбом с id ${id} не найден` };
    }

    return { message: ' Альбом был успешно удален' };
  }
}

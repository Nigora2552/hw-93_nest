import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { CreateArtistDto } from './create-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  @Get()
  async getAll() {
    return this.artistModel.find();
  }
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.artistModel.findById(id);
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads/artists',
        filename: (_req, file, callback) => {
          const uniqueSuffix = randomUUID();
          callback(null, `artist-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() artistDto: CreateArtistDto,
  ) {
    const newArtist = new this.artistModel({
      name: artistDto.name,
      description: artistDto.description,
      isPublished: artistDto.isPublished,
      image: file ? '/uploads/artist/' + file.filename : null,
    });
    return newArtist.save();
  }
  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    const deletedArtist = await this.artistModel.findByIdAndDelete(id);

    if (!deletedArtist) {
      return { message: `Артист с id ${id} не найден` };
    }

    return { message: ' Артист был успешно удален' };
  }
}

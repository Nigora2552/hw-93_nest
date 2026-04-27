import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterUserDto } from './register-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}
  @Post()
  register(@Body() userDto: RegisterUserDto) {
    const user = new this.userModel({
      email: userDto.email,
      password: userDto.password,
      displayName: userDto.displayName,
    });
    user.generateToken();
    return user.save();
  }
  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  login(@Req() req: { user: User }) {
    return req.user;
  }
}

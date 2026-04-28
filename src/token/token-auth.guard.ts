import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token: string = request.get('Authorization') as string;
    if (!token) return false;

    const user = await this.userModel.findOne({ token });
    if (!user) return false;

    const adminOnly = this.reflector.get<boolean>(
      'adminOnly',
      context.getHandler(),
    );
    if (adminOnly && user.role !== 'admin') {
      throw new ForbiddenException('Только админ может удалить!');
    }

    request.user = user;
    return true;
  }
}

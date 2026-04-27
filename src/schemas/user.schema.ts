import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

export interface UserMethods {
  generateToken: () => void;
  checkPassword: (this: UserDocument, password: string) => Promise<boolean>;
}

export type UserDocument = User & Document & UserMethods;
@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  displayName: string;
  @Prop({ required: true })
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.checkPassword = function (
  this: UserDocument,
  password: string,
) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  this.token = randomUUID();
};

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { email, displayName, token } = ret;
    return { email, displayName, token };
  },
});

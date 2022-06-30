import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';
import { UserStatus } from './dto/create-user.dto';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret: UserDocument) => {
      const { password, ...rest } = ret;
      return rest;
    },
    versionKey: false,
  },
})
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: [UserStatus.Active, UserStatus.Inactive],
    default: UserStatus.Active,
  })
  status: string;

  @Prop()
  phoneNumber: string;

  @Prop({
    type: [String],
    default: [Role.User],
  })
  roles: string[];

  validatePassword: Function;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.validatePassword = async function (
  password: string,
): Promise<boolean> {
  console.log('password', password);
  console.log('this.password', this.password);

  return bcrypt.compare(password, this.password);
};

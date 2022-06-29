import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEmail, isPhoneNumber } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    type: String,
    required: true,
    validate: {
      validator: (value: string) => isEmail(value),
      message: 'Please Enter valid email',
    },
  })
  email: string;

  @Prop()
  password: string;

  @Prop({
    type: String,
    required: true,
    enum: ['active', 'inActive'],
    default: 'active',
  })
  status: string;

  @Prop({
    type: String,
    validate: {
      validator: (value: string) => isPhoneNumber(value),
      message: 'Please Enter valid phone number',
    },
  })
  phoneNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

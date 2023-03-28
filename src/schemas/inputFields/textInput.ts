import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

export type TextInputDocument = TextInput & Document;

@Schema({
  timestamps: true,
  toJSON: {
    versionKey: false,
    virtuals: true,
  },
  toObject: { virtuals: true },
})
export class TextInput {
  @Prop({
    type: String,
    required: true,
  })
  id: string;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    enum: ['text', 'password', 'number', 'search', 'email', 'tel', 'url'],
  })
  type: string;

  @Prop({
    type: String,
    enum: ['text', 'password', 'number', 'search', 'email', 'tel', 'url'],
  })
  autocomplete: string;
}

export const TextInputSchema = SchemaFactory.createForClass(TextInput);

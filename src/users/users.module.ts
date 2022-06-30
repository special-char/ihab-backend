import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/user.schema';
import { NextFunction } from 'express';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', function (next: NextFunction) {
            const user = this;

            if (!user.isModified('password')) return next();

            bcrypt.genSalt(10, (err, salt) => {
              if (err) return next(err);
              bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
                next();
              });
            });
          });

          UserSchema.methods.checkPassword = function (attempt, callback) {
            let user = this;
            bcrypt.compare(attempt, user.password, (err, isMatch) => {
              if (err) return callback(err);
              callback(null, isMatch);
            });
          };

          return schema;
        },
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

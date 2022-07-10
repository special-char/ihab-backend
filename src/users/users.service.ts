import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(
    createUserDto: CreateUserDto & { roles?: Role[] },
    session: ClientSession | null = null,
  ): Promise<
    UserDocument & {
      _id: Types.ObjectId;
    }
  > {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save({
      session,
    });
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email: email });
  }
}

import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Workbook } from 'exceljs'
import { ClientSession, Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/common/enums/role.enum';
import { writeFile } from 'fs/promises'
import * as tmp from 'tmp';
import { join, parse } from 'path';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

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

  async findAllAdmin(query): Promise<User[]> {
    let searchQuery = {};

    if (query.name) {
      searchQuery = {
        ...searchQuery,
        $or: [
          {
            firstName: {
              $regex: `${query.name}`,
              $options: 'i'
            },
          },
          {
            lastName: {
              $regex: `${query.name}`,
              $options: 'i'
            }
          }
        ]
      }
    }

    return this.userModel.find({
      ...searchQuery,
      roles: {
        $in: ['admin']
      }
    }).exec()
  }

  async generateAdminExcel() {
    var workbook = new Workbook();
    var worksheet = workbook.addWorksheet('My Sheet');
    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 32 },
      { header: 'D.O.B.', key: 'DOB', width: 10 }
    ];
    worksheet.addRow({ id: 1, name: 'John Doe', dob: new Date(1970, 1, 1) });
    worksheet.addRow({ id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7) });

    const path = join(process.cwd(), 'adminFile.csv')

    await workbook.csv.writeFile(path)

    return path;
  }
}

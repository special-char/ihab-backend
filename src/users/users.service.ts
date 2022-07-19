import { BadRequestException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Workbook } from 'exceljs'
import { ClientSession, Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/common/enums/role.enum';
import { writeFile } from 'fs/promises'
import * as tmp from 'tmp';
import { join, parse } from 'path';
import { NotFoundError } from 'rxjs';
import { PathLike } from 'fs';

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

  async findAllAdmin(query?: any): Promise<User[]> {
    let searchQuery = {};

    if (query?.name) {
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
    const admins = await this.findAllAdmin();

    if (!admins) throw new NotFoundException("No data to download")

    var workbook = new Workbook();
    var worksheet = workbook.addWorksheet('My Sheet');
    worksheet.columns = [
      { header: 'Id', key: '_id', width: 30 },
      { header: 'First Name', key: 'firstName', width: 32 },
      { header: 'Last Name', key: 'lastName', width: 32 },
      { header: 'Email', key: 'email', width: 32 },
      { header: 'Status', key: 'status', width: 32 },
      { header: 'Phone Number', key: 'phoneNumber', width: 20 },
    ];

    for (let i = 0; i < admins.length; i++) {
      worksheet.addRow(admins[i]);
    }

    const File = await new Promise((resolve) => {
      tmp.file({ discardDescriptor: true, prefix: 'adminList', postfix: '.xlsx' }, async (err, path, fd, cleanupCallback) => {
        if (err) throw new BadRequestException(err);
        await workbook.xlsx.writeFile(path)
        resolve(path);
      });

    })

    return File as PathLike;
  }
}

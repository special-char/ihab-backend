import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Workbook } from 'exceljs'
import { ClientSession, Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/common/enums/role.enum';
import { writeFile } from 'fs/promises'
import * as tmp from 'tmp';
import { parse } from 'path';

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

  async findAllAdmin(): Promise<User[]> {
    return this.userModel.find({
      roles: {
        $in: ['admin']
      }
    }).exec()
  }

  async generateAdminExcel(): Promise<any> {
    var workbook = new Workbook();
    var worksheet = workbook.addWorksheet('My Sheet');
    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 32 },
      { header: 'D.O.B.', key: 'DOB', width: 10 }
    ];
    worksheet.addRow({ id: 1, name: 'John Doe', dob: new Date(1970, 1, 1) });
    worksheet.addRow({ id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7) });


    let File = await new Promise((resolve, reject) => {
      tmp.file({ discardDescriptor: true, prefix: 'admin-', postfix: '.xlsx', mode: parseInt('0600', 8) }, async (err, path) => {
        if (err) throw new BadRequestException(err);

        await workbook.xlsx.writeFile(path);
        resolve(path)

      });
    })


    return File;

  }
}

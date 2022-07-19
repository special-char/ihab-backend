import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Workbook } from 'exceljs';
import { PathLike } from 'fs';
import mongoose, { Model } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';
import { Category } from 'src/schemas/category.schema';
import { Retailer, RetailerDocument } from 'src/schemas/retailers.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { RetailerDto } from 'src/utils/dtos';
import * as tmp from 'tmp';

@Injectable()
export class RetailerService {
  constructor(
    @InjectModel(Retailer.name) private retailerModel: Model<RetailerDocument>,
    private readonly usersService: UsersService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) { }

  async findAll(query?: any): Promise<Retailer[]> {
    let searchQuery = {};

    if (query?.name) {
      searchQuery = {
        ...searchQuery,
        registeredBusinessName: {
          $regex: `${query.name}`,
          $options: 'i'
        }
      }
    }

    return this.retailerModel
      .find(searchQuery)
      .populate('user', ['firstName', 'lastName', 'email', 'phoneNumber'])
      .exec();
  }

  async findById(id: string): Promise<Retailer> {
    return this.retailerModel.findById(id).exec();
  }

  async create(retailer: RetailerDto & CreateUserDto): Promise<Retailer> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const {
        firstName,
        lastName,
        email,
        password,
        status,
        phoneNumber,
        ...rest
      } = retailer;

      const user = await this.usersService.create(
        {
          firstName,
          lastName,
          email,
          password,
          status,
          phoneNumber,
          roles: [Role.Retailer],
        },
        session,
      );

      const newRetailer = new this.retailerModel({
        ...rest,
        slug: rest.registeredBusinessName.replaceAll(' ', '_'),
        user,
      });
      await newRetailer.save({ session });
      await session.commitTransaction();
      session.endSession();
      return newRetailer;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async assignCategories(
    categories: Category[],
    id: string,
  ): Promise<Retailer> {
    return this.retailerModel.findByIdAndUpdate(
      { _id: id },
      { categories: categories },
      { new: true },
    );
    // return newRetailer.save();
  }

  async downlaodRetailers() {
    const retailers = await this.findAll();

    if (!retailers) throw new NotFoundException("No data to download")

    var workbook = new Workbook();
    var worksheet = workbook.addWorksheet('My Sheet');
    worksheet.columns = [
      { header: 'Business Name', key: 'businessName', width: 30 },
      { header: 'Suburb', key: 'suburb', width: 32 },
      { header: 'First Name', key: 'firstName', width: 32 },
      { header: 'Last Name', key: 'lastName', width: 32 },
      { header: 'Phone', key: 'phone', width: 32 },
      { header: 'Mobile', key: 'mobile', width: 20 },
      { header: 'Email', key: 'email', width: 20 },
      { header: 'Address 1', key: 'address1', width: 20 },
      { header: 'Address2	', key: 'address2', width: 20 },
      { header: 'Id', key: 'id', width: 20 },
    ];

    retailers.map((x) => ({
      businessName: x.registeredBusinessName,
      suburb: x.suburb,
      firstName: x.user.firstName,
      lastName: x.user.lastName,
      phone: x.user.phoneNumber,
      mobile: x.ownerPhone,
      email: x.user.email,
      address1: x.address1,
      address2: x.address2,
      id: x._id,
    })).forEach(item => worksheet.addRow(item))

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

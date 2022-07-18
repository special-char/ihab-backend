import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';
import { Category } from 'src/schemas/category.schema';
import { Retailer, RetailerDocument } from 'src/schemas/retailers.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { RetailerDto } from 'src/utils/dtos';

@Injectable()
export class RetailerService {
  constructor(
    @InjectModel(Retailer.name) private retailerModel: Model<RetailerDocument>,
    private readonly usersService: UsersService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) { }

  async findAll(query): Promise<Retailer[]> {
    let searchQuery = {};

    if (query.name) {
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
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Offer, OfferDocument } from 'src/schemas/offers.schema';
import { Order, OrderDocument } from 'src/schemas/order.schema';
import { OfferStatus } from 'src/utils/types';

@Injectable()
export class OrdersService {

    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
        @InjectConnection() private readonly connection: mongoose.Connection,
    ) { }

    async create(order: Order): Promise<Order> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const offer = await this.offerModel.findById(order.offer).exec();

            if (offer.status === OfferStatus.Inactive) {
                throw new BadRequestException("Offer is inactive")
            }

            offer.status = OfferStatus.Inactive
            await offer.save({ session })

            const dta = new this.orderModel(order);
            const newOrder = await dta.save({ session });
            await session.commitTransaction();
            session.endSession();
            return newOrder
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async findAll(): Promise<Order[]> {
        return this.orderModel.find().exec();
    }

    async findOne(id: string): Promise<Order> {
        return this.orderModel.findById(id).exec();
    }
}

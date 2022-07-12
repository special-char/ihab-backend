import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from 'src/schemas/order.schema';

@Injectable()
export class OrdersService {

    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    ) { }

    async create(order: Order): Promise<Order> {
        const dta = new this.orderModel(order);
        return dta.save();
    }

    async findAll(): Promise<Order[]> {
        return this.orderModel.find().exec();
    }

    async findOne(id: string): Promise<Order> {
        return this.orderModel.findById(id).exec();
    }
}

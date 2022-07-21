import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Workbook } from 'exceljs';
import { PathLike } from 'fs';
import mongoose, { Model } from 'mongoose';
import { Offer, OfferDocument } from 'src/schemas/offers.schema';
import { Order, OrderDocument } from 'src/schemas/order.schema';
import { OfferStatus } from 'src/utils/types';
import * as tmp from 'tmp';

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

    async update(id, order): Promise<Order> {
        return this.orderModel.findByIdAndUpdate(id, order).exec()
    }

    async findAll(): Promise<Order[]> {
        return this.orderModel.find().populate('retailerOffer').exec();
    }



    async findOne(id: string): Promise<Order> {
        return this.orderModel.findById(id).populate('user').populate({
            path: 'offer',
            populate: [
                {
                    path: 'productId'
                }
            ],
        }).populate({
            path: 'retailerOffer',
            populate: [
                {
                    path: 'retailer'
                }
            ],
        }).exec();
    }

    async downlaodOrders() {
        const orders = await this.findAll();

        if (!orders) throw new NotFoundException("No data to download")

        var workbook = new Workbook();
        var worksheet = workbook.addWorksheet('My Sheet');
        worksheet.columns = [
            { header: 'Order Number', key: 'orderNumber', width: 30 },
            { header: 'Order Date', key: 'date', width: 32 },
            { header: 'Customer', key: 'customer', width: 32 },
            { header: 'Items', key: 'items', width: 32 },
            { header: 'Total Price', key: 'totalPrice', width: 32 },
            { header: 'Payment Status', key: 'paymentStatus', width: 20 },
            { header: 'Order Status', key: 'orderStatus', width: 20 },
            { header: 'Retailer Payment Status', key: 'retailerPaymentStatus', width: 20 },
            { header: 'Customer Offer', key: 'shipping', width: 20 },
        ];

        orders.map((x) => ({
            orderNumber: x._id,
            date: x.createdAt,
            customer: `${x.customerFirstName} ${x.customerLastName}`,
            items: `${x.itemQuantity} item(s)`,
            totalPrice: new Intl.NumberFormat("en-AU", {
                style: "currency",
                currency: "AUD",
            }).format(x.itemQuantity * x.retailerOffer.offerPrice),
            paymentStatus: x.paymentStatus,
            orderStatus: x.orderStatus,
            retailerPaymentStatus: x.retailerPaymentStatus,
            shipping: x.customerOffer,
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

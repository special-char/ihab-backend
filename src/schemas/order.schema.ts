import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { User } from 'src/users/user.schema';
import { OrderStatus, PaymentStatus } from 'src/utils/types';
import { Offer } from './offers.schema';
import { Product } from './product.schema';
import { RetailerOffer } from './retailerOffers.schema';

export type OrderDocument = Order & Document;

@Schema({
    timestamps: true,
    toJSON: {
        versionKey: false,
        virtuals: true,
    },
    toObject: { virtuals: true },
})
export class Order {
    @Prop({ type: MongoSchema.Types.ObjectId, ref: User.name })
    user: User;

    @Prop({ type: MongoSchema.Types.ObjectId, ref: Offer.name })
    offer: Offer;

    @Prop({ type: MongoSchema.Types.ObjectId, ref: RetailerOffer.name })
    retailerOffer: RetailerOffer;

    @Prop({
        type: String,
        required: true,
        default: OrderStatus.InProgress,
        enum: [OrderStatus.InProgress, OrderStatus.Shipped, OrderStatus.Delivered, OrderStatus.Cancelled],
    })
    orderStatus: string;

    @Prop({
        type: String,
        required: true,
        default: PaymentStatus.Unpaid,
        enum: [PaymentStatus.Unpaid, PaymentStatus.Paid],
    })
    paymentStatus: string;

    @Prop()
    customerFirstName: string;

    @Prop()
    customerLastName: string;

    @Prop()
    customerCountry: string;

    @Prop()
    customerAddress: string;

    @Prop()
    customerCity: string;

    @Prop()
    customerPostcode: string;

    @Prop()
    deliverCountry: string;

    @Prop()
    deliverAddress: string;

    @Prop()
    deliverCity: string;

    @Prop()
    deliverPostcode: string;

    @Prop({
        default: "DISBURSE TO RETAILER"
    })
    retailerPaymentStatus: string;

    @Prop({
        default: "Standard Delivery - Retailer Managed"
    })
    customerOffer: string;

    @Prop({
        default: 1
    })
    itemQuantity: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);


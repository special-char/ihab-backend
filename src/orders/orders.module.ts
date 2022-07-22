import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { Offer, OfferSchema } from 'src/schemas/offers.schema';
import { RetailerOffer, RetailerOfferSchema } from 'src/schemas/retailerOffers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Offer.name, schema: OfferSchema },
      { name: RetailerOffer.name, schema: RetailerOfferSchema },
    ]),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule { }

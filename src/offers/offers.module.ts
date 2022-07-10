import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Offer, OfferSchema } from 'src/schemas/offers.schema';
import {
  RetailerOffer,
  RetailerOfferSchema,
} from 'src/schemas/retailerOffers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Offer.name, schema: OfferSchema },
      { name: RetailerOffer.name, schema: RetailerOfferSchema },
    ]),
  ],
  providers: [OffersService],
  controllers: [OffersController],
})
export class OffersModule {}

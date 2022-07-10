import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Offer, OfferDocument } from 'src/schemas/offers.schema';
import {
  RetailerOffer,
  RetailerOfferDocument,
} from 'src/schemas/retailerOffers.schema';
import { RetailerOfferStatus } from 'src/utils/types';
import { CounterOfferDto } from './dto/counter-offer.dto';
import { MakeOfferDto } from './dto/make-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
    @InjectModel(RetailerOffer.name)
    private retailerOfferModel: Model<RetailerOfferDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async create(offer: MakeOfferDto & { userId: string }): Promise<Offer> {
    const currentTime = new Date();

    const offers = await this.offerModel
      .find({
        userId: offer.userId,
        productId: offer.productId,
        offerStartTime: {
          $lt: currentTime,
        },
        offerEndTime: {
          $gt: currentTime,
        },
      })
      .exec();

    if (offers.length > 0) {
      throw new BadRequestException('Offer is still active');
    }

    const newOffer = new this.offerModel(offer);
    return newOffer.save();
  }

  async findAll(): Promise<Offer[]> {
    const currentTime = new Date();
    return this.offerModel
      .find({
        offerStartTime: {
          $lt: currentTime,
        },
        offerEndTime: {
          $gt: currentTime,
        },
      })
      .populate('productId')
      .exec();
  }

  async findOne(id: string): Promise<Offer> {
    return this.offerModel.findById(id).exec();
  }

  async counterOffer(
    offer: CounterOfferDto & { retailerId: string },
  ): Promise<Offer> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const retailerOffer = await this.retailerOfferModel.findOneAndUpdate(
        {
          OfferId: offer.offerId,
          retailerId: offer.retailerId,
          status: RetailerOfferStatus.Pending,
        },
        {
          OfferId: offer.offerId,
          retailerId: offer.retailerId,
          offerPrice: offer.offerPrice,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      const updatedOffer = this.offerModel.findByIdAndUpdate(offer.offerId, {
        $addToSet: {
          retailerOffers: retailerOffer._id,
        },
      });
      await session.commitTransaction();
      session.endSession();
      return updatedOffer;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}

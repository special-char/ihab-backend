import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Offer, OfferDocument } from 'src/schemas/offers.schema';
import {
  RetailerOffer,
  RetailerOfferDocument,
} from 'src/schemas/retailerOffers.schema';
import { Retailer, RetailerDocument } from 'src/schemas/retailers.schema';
import { OfferStatus, RetailerOfferStatus } from 'src/utils/types';
import { CounterOfferDto } from './dto/counter-offer.dto';
import { MakeOfferDto } from './dto/make-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
    @InjectModel(Retailer.name) private retailerModel: Model<RetailerDocument>,
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
        variantId: offer.variantId,
        offerStartTime: {
          $lt: currentTime,
        },
        offerEndTime: {
          $gt: currentTime,
        },
        status: OfferStatus.Active,
      })
      .exec();

    if (offers.length > 0) {
      throw new BadRequestException('Offer is still active');
    }

    const newOffer = new this.offerModel(offer);
    return newOffer.save();
  }

  async newOffers(retailerId): Promise<Offer[]> {
    const retailerOffers = await this.retailerOfferModel.find(
      { retailerId },
      '_id',
    );

    const currentTime = new Date();

    return this.offerModel
      .find({
        offerStartTime: {
          $lt: currentTime,
        },
        offerEndTime: {
          $gt: currentTime,
        },
        retailerOffers: {
          $nin: retailerOffers.map((x) => x._id.toString()),
        },
        status: OfferStatus.Active,
      })
      .populate('productId')
      .populate({
        path: 'retailerOffers',
        match: {
          retailerId,
        },
      })
      .exec();
  }

  async retailerAppliedOffers(retailerId): Promise<Offer[]> {
    const retailerOffers = await this.retailerOfferModel.find(
      { retailerId },
      '_id',
    );

    const currentTime = new Date();

    return this.offerModel
      .find({
        offerStartTime: {
          $lt: currentTime,
        },
        offerEndTime: {
          $gt: currentTime,
        },
        retailerOffers: {
          $in: retailerOffers.map((x) => x._id.toString()),
        },
        status: OfferStatus.Active,
      })
      .populate('productId')
      .populate({
        path: 'retailerOffers',

        match: {
          retailerId,
        },
      })
      .exec();
  }

  async findOne(
    userId: string,
    productId: string,
    variantId: string,
  ): Promise<Offer> {
    const currentTime = new Date();

    return this.offerModel
      .findOne({
        productId,
        userId,
        status: OfferStatus.Active,
        variantId: variantId,
        offerStartTime: {
          $lt: currentTime,
        },
        offerEndTime: {
          $gt: currentTime,
        },
      })
      .populate({
        path: 'retailerOffers',
        populate: [
          {
            path: 'retailer',
          },
        ],
      })
      .exec();
  }

  async findAll(userId: string): Promise<Offer[]> {
    return this.offerModel
      .find({
        userId,
      })
      .populate('productId')
      .populate({
        path: 'retailerOffers',
        populate: [
          {
            path: 'retailer',
          },
        ],
      })
      .exec();
  }

  async counterOffer(
    offer: CounterOfferDto & { retailerId: string },
  ): Promise<Offer> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const retailerDetail = await this.retailerModel
        .findOne({ user: offer.retailerId })
        .select('_id')
        .exec();

      console.log(retailerDetail);

      const retailerOffer = await this.retailerOfferModel.findOneAndUpdate(
        {
          OfferId: offer.offerId,
          retailerId: offer.retailerId,
          retailer: retailerDetail._id,
          status: RetailerOfferStatus.Pending,
        },
        {
          OfferId: offer.offerId,
          retailerId: offer.retailerId,
          retailer: retailerDetail._id,
          offerPrice: offer.offerPrice,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true, session },
      );

      const updatedOffer = await this.offerModel.findByIdAndUpdate(
        offer.offerId,
        {
          $addToSet: {
            retailerOffers: retailerOffer._id,
          },
        },
        {
          session,
        },
      );
      await session.commitTransaction();
      session.endSession();
      return updatedOffer;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }


  async rejectOffer() {

  }
}

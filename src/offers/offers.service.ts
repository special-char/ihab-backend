import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Offer, OfferDocument } from 'src/schemas/offers.schema';
import { MakeOfferDto } from './dto/make-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
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
      .exec();
  }

  async findOne(id: string): Promise<Offer> {
    return this.offerModel.findById(id).exec();
  }
}

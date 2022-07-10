import { IsNotEmpty, IsString } from 'class-validator';

export class CounterOfferDto {
  @IsString()
  @IsNotEmpty()
  offerId: string;

  @IsNotEmpty()
  offerPrice: number;
}

import { IsCurrency, IsNotEmpty, IsString } from 'class-validator';

export class MakeOfferDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  customerOfferPrice: number;
}

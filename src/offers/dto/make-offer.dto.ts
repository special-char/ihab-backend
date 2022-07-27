import { IsCurrency, IsNotEmpty, IsString } from 'class-validator';

export class MakeOfferDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  variantId: string;

  @IsNotEmpty()
  customerOfferPrice: number;
}

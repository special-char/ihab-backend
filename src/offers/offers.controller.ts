import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Offer } from 'src/schemas/offers.schema';
import { CounterOfferDto } from './dto/counter-offer.dto';
import { MakeOfferDto } from './dto/make-offer.dto';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly offerService: OffersService) { }

  @Post('make-offer')
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  makeOffer(
    @Req() req: Request & { user: any },
    @Body() dto: MakeOfferDto,
  ): Promise<Offer> {
    const { userId } = req.user;
    return this.offerService.create({ ...dto, userId });
  }

  @Post('counter-offer')
  @Roles(Role.Retailer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  makeCounterOffer(
    @Req() req: Request & { user: any },
    @Body() dto: CounterOfferDto,
  ): Promise<Offer> {
    const { userId } = req.user;
    return this.offerService.counterOffer({ ...dto, retailerId: userId });
  }

  @Get('new-offers')
  @Roles(Role.Retailer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getOffers(@Req() req: Request & { user: any }): Promise<Offer[]> {
    const { userId } = req.user;
    return this.offerService.newOffers(userId);
  }

  @Get('applied-offers')
  @Roles(Role.Retailer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getAppliedOffers(@Req() req: Request & { user: any }): Promise<Offer[]> {
    const { userId } = req.user;
    return this.offerService.retailerAppliedOffers(userId);
  }

  @Get(':productId')
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getOffer(@Req() req: Request & { user: any }, @Param() params): Promise<Offer> {
    const { userId } = req.user;
    return this.offerService.findOne(userId, params?.productId);
  }

  @Get()
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  getAllOffer(@Req() req: Request & { user: any }): Promise<Offer[]> {
    const { userId } = req.user;
    return this.offerService.findAll(userId);
  }
}

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
  constructor(private readonly offerService: OffersService) {}

  @Post()
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  makeOffer(
    @Req() req: Request & { user: any },
    @Body() dto: MakeOfferDto,
  ): Promise<Offer> {
    const { userId } = req.user;
    console.log('req.user', req.user.userId);
    console.log('dto', dto);
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
    console.log('req.user', req.user.userId);
    console.log('dto', dto);
    return this.offerService.counterOffer({ ...dto, retailerId: userId });
  }

  @Get()
  getOffers(): Promise<Offer[]> {
    return this.offerService.findAll();
  }
  @Get(':id')
  getOffer(@Param() params): Promise<Offer> {
    return this.offerService.findOne(params?.id);
  }
}

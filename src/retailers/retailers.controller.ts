import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Category } from 'src/schemas/category.schema';
import { Retailer, RetailerSchema } from 'src/schemas/retailers.schema';
import { RetailerService } from './retailers.service';

@Controller('retailers')
export class RetailerController {
  constructor(private readonly retailerService: RetailerService) {}

  @Get()
  getRetailers(): Promise<Retailer[]> {
    return this.retailerService.findAll();
  }
  @Get(':id')
  getRetailer(@Param() params): Promise<Retailer> {
    return this.retailerService.findById(params?.id);
  }
  @Post()
  @ApiBody({ type: Retailer })
  createRetailer(@Body() dto: Retailer): Promise<Retailer> {
    return this.retailerService.create(dto);
  }
  @Patch()
  assignCategories(@Body() dto: CatType): Promise<Retailer> {
    return this.retailerService.assignCategories(dto.categories, dto.id);
  }
}

interface CatType {
  id: string;
  categories: Category[];
}

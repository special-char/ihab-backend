import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  // Req,
  // UploadedFiles,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Category } from 'src/schemas/category.schema';
import { Retailer } from 'src/schemas/retailers.schema';
import { RetailerService } from './retailers.service';
// import { FastifyFileFieldsInterceptor } from 'nest-fastify-multer';

// import { diskStorage } from 'multer';
import { RetailerDto } from 'src/utils/dtos';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

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
  async createRetailer(
    @Body() dto: RetailerDto & CreateUserDto,
  ): Promise<Retailer> {
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

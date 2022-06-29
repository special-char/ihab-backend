import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Category } from 'src/schemas/category.schema';
import { Retailer } from 'src/schemas/retailers.schema';
import { RetailerService } from './retailers.service';
import { FastifyFileFieldsInterceptor } from 'nest-fastify-multer';

import { diskStorage } from 'multer';
import {
  editFileName,
  fileMapper,
  imageFileFilter,
} from 'src/utils/fileOperation';
import { RetailerDto } from 'src/utils/dtos';

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
  @FastifyFileFieldsInterceptor(
    [
      { name: 'logo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ],
    {
      storage: diskStorage({
        destination: './upload',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    },
  )
  createRetailer(
    @Req() req: Request,
    @UploadedFiles()
    files: { logo?: Express.Multer.File[]; banner?: Express.Multer.File[] },
    @Body() dto: RetailerDto,
  ): Promise<Retailer> {
    const data = {
      ...dto,
      logo: fileMapper(logo, req),
      banner: fileMapper(banner, req),
    };
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

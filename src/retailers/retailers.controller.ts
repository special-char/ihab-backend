import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  Response,
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
import { createReadStream } from 'fs';

@Controller('retailers')
export class RetailerController {
  constructor(private readonly retailerService: RetailerService) { }

  @Get()
  getRetailers(@Query() query): Promise<Retailer[]> {
    return this.retailerService.findAll(query);
  }

  @Get(':id')
  getRetailer(@Param('id') id: string): Promise<Retailer> {
    return this.retailerService.findById(id);
  }

  @Post()
  @ApiBody({ type: Retailer })
  createRetailer(@Body() dto: RetailerDto & CreateUserDto): Promise<Retailer> {
    return this.retailerService.create(dto);
  }

  @Patch(':id')
  assignCategories(
    @Param('id') id: string,
    @Body() dto: Category[],
  ): Promise<Retailer> {
    return this.retailerService.assignCategories(dto, id);
  }

  @Get('download')
  @Header("Content-Disposition", 'attachment; filename="retailerList.xlsx')
  async downloadRetailers(@Response({ passthrough: true }) res) {
    const path = await this.retailerService.downlaodRetailers()
    const file = createReadStream(path)
    res.type('text/xlsx').send(file);
  }
}

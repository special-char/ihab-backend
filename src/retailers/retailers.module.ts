import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Retailer, RetailerSchema } from 'src/schemas/retailers.schema';
import { RetailerController } from './retailers.controller';
import { RetailerService } from './retailers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Retailer.name, schema: RetailerSchema },
    ]),
  ],
  controllers: [RetailerController],
  providers: [RetailerService],
})
export class RetailerModule {}

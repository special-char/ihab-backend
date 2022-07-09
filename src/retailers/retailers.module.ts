import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Retailer, RetailerSchema } from 'src/schemas/retailers.schema';
import { UsersModule } from 'src/users/users.module';
import { RetailerController } from './retailers.controller';
import { RetailerService } from './retailers.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Retailer.name, schema: RetailerSchema },
    ]),
  ],
  controllers: [RetailerController],
  providers: [RetailerService],
})
export class RetailerModule {}

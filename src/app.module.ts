import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { RetailerModule } from './retailers/retailers.module';

interface DatabaseConfig {
  url: string;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const database = config.get<DatabaseConfig>('database');

        return {
          uri: database.url,
        };
      },
    }),
    CoreModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    RetailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

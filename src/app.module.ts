import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
      load: [configuration],
    }),

    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('HOST'),
    //     port: configService.get('PORT'),
    //     username: configService.get('USERNAME'),
    //     password: configService.get('PASSWORD'),
    //     database: configService.get('DATABASE'),
    //     entities: [],
    //     synchronize: true,
    //   }),
    //   inject: [ConfigService],
    // }),

    CoreModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

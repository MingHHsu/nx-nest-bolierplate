import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StatusMonitorModule } from 'nestjs-status-monitor';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@libs/users';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    StatusMonitorModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        database: config.get('DB_DATABASE'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        schema: 'booking',
        synchronize: true,
        autoLoadEntities: true,
        logger: 'advanced-console',
        logging: true,
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

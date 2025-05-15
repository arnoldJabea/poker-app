import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TablesModule } from './tables/tables.module';
import { PlayersModule } from './players/players.module';
import { AuthModule } from './auth/auth.module';
import { Player } from './entities/player.entity';
import { Table } from './tables/entities/table.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [Player, Table],
        synchronize: true,
      }),
    }),
    PlayersModule,
    TablesModule,
    AuthModule,
    TypeOrmModule.forFeature([Player, Table]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

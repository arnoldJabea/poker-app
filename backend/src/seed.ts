import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Player } from './entities/player.entity';
import { Table } from './tables/entities/table.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const playerRepo = dataSource.getRepository(Player);
  const tableRepo = dataSource.getRepository(Table);

  //  Créer deux joueurs
  const player1 = playerRepo.create({ username: 'louis', money: 1500 });
  const player2 = playerRepo.create({ username: 'arnold', money: 2000 });

  await playerRepo.save([player1, player2]);

  //  Créer deux tables persistées
  const table1 = tableRepo.create({ name: 'Table 1', bigBlind: 20 });
  const table2 = tableRepo.create({ name: 'Table 2', bigBlind: 50 });

  await tableRepo.save([table1, table2]);

  console.log('✅ Seed terminé !');
  await app.close();
}

seed();
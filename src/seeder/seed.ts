import { NestFactory } from '@nestjs/core';

import { SeedModule } from './seed.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seederService = app.get(SeederService);
  await seederService.seed();
  await app.close();
}
void bootstrap();

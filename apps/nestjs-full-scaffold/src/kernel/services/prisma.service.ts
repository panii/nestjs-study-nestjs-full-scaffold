import { INestApplication, Scope, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable({
  scope: Scope.DEFAULT,
})
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    if (process.env.DB_PRISMA_ENABLE === 'yes') {
      await this.$connect();
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    if (process.env.DB_PRISMA_ENABLE === 'yes') {
      this.$on('beforeExit', async () => {
        await app.close();
      });
    }
  }
}
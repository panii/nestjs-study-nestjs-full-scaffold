import { INestApplication, Scope, Injectable, OnModuleInit, OnApplicationShutdown, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable({
  scope: Scope.DEFAULT,
})
export class PrismaService extends PrismaClient implements OnModuleInit, OnApplicationShutdown {
  async onModuleInit() {
    if (process.env.DB_PRISMA_ENABLE === 'yes') {
      await this.$connect();
    }
  }

  async onApplicationShutdown(signal: string) {
    Logger.log('PrismaService onApplicationShutdown ' + signal);
    // console.log('PrismaService onApplicationShutdown ', signal); // e.g. "SIGINT"
    // await this.timeout(5000);
    await this.$disconnect();
  }
  
  timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // async enableShutdownHooks(app: INestApplication) {
  //   if (process.env.DB_PRISMA_ENABLE === 'yes') {
  //     console.log("PrismaService beforeExit");
  //     this.$on('beforeExit', async () => {
  //       console.log("PrismaService on beforeExit");
  //       await app.close();
  //     });
  //   }
  // }
}

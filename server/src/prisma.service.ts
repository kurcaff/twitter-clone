import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ DATABASE CONNECTED SUCCESSFULLY');
    } catch (error) {
      console.error('❌ DATABASE CONNECTION FAILED:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from "@prisma/client"
// we want to implement also the onModule sync and onModule

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleDestroy() {
        await this.$disconnect;
    }
    async onModuleInit() {
        await this.$connect;
    }

}

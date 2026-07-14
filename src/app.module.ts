import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { CardModule } from './card/card.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    AuthModule,BoardModule,CardModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'card-queue',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
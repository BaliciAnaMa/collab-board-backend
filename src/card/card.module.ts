import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EventsGateway } from '../events.gateway';
import { BullModule } from '@nestjs/bullmq'; // <--- ACEASTA ESTE LINIA CARE LIPA

@Module({
  imports: [
    PrismaModule, 
    BullModule.registerQueue({
      name: 'card-queue',
    }),
  ],
  controllers: [CardController],
  providers: [CardService, EventsGateway],
})
export class CardModule {}
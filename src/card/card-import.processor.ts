import { Processor } from '@nestjs/bullmq';
import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events.gateway';

@Processor('card-queue')
export class CardImportProcessor extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    console.log(`Procesez job-ul: ${job.name}`);

    if (job.name === 'import-batch') {
      try {
        const { cards, boardId } = job.data;
        console.log(`Am primit ${cards.length} carduri pentru board-ul ${boardId}`);

       for (const card of cards) {
          console.log("DEBUG: Card titlu:", card.title, "| Status citit din CSV:", card.status);
          
          // 1. Definește variabila statusValue aici
          const statusValue = card.status ? card.status.toLowerCase() : 'todo';

          const newCard = await this.prisma.card.create({
            data: {
              title: card.title,
              status: statusValue, // 2. Folosește variabila aici, în loc de 'todo'
              board: { connect: { id: Number(boardId) } }
            }
          });
          
          // Notificăm frontend-ul că un card a fost creat
          this.eventsGateway.server.emit('cardCreated', newCard);
          console.log(`Card creat cu succes: ${newCard.title} cu status: ${newCard.status}`);
        }

        console.log("Import finalizat cu succes!");
        return { success: true };

      } catch (error) {
        console.error("EROARE CRITICĂ ÎN PROCESSOR:", error);
        throw error; // Aruncăm eroarea ca BullMQ să știe că a eșuat (pentru retry)
      }
    }
  }
}
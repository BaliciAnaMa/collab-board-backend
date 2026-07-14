import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { EventsGateway } from '../events.gateway';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CardService {
  constructor(
    private readonly prisma: PrismaService,
    private eventsGateway: EventsGateway,
    @InjectQueue('card-queue') private cardQueue: Queue,
  ) {}

  // Funcție de formatare (pe care o aveai deja)
  formatCardName(name: string): string {
    return name.trim().toUpperCase();
  }

  // --- CRUD cu Live Updates ---

  async create(boardId: number, createCardDto: CreateCardDto) {
    const newCard = await this.prisma.card.create({
      data: {
        title: createCardDto.title,
        status: createCardDto.status || 'todo',
        board: {
          connect: { id: Number(boardId) }
        }
      },
    });

    // 1. Notificăm clienții live (WebSocket)
    this.eventsGateway.server.emit('cardCreated', newCard);

    // 2. Adăugăm în coadă pentru background job
    await this.cardQueue.add('card-created-job', { 
      cardId: newCard.id,
      message: 'Card creat cu succes!' 
    });

    return newCard;
  }

  async findAll(boardId: number) {
    return this.prisma.card.findMany({
      where: { boardId: Number(boardId) },
    });
  }

  async findOne(id: number) {
    return this.prisma.card.findUnique({
      where: { id: Number(id) },
    });
  }

  async update(id: number, updateCardDto: UpdateCardDto) {
    const updatedCard = await this.prisma.card.update({
      where: { id: Number(id) },
      data: updateCardDto,
    });

    // Notificare live pentru update-ul general
    this.eventsGateway.server.emit('cardUpdated', updatedCard);
    return updatedCard;
  }

  // Funcție specifică pentru mutarea task-ului (ex: din todo în done)
  async updateStatus(id: number, status: string) {
    const updatedCard = await this.prisma.card.update({
      where: { id: Number(id) },
      data: { status: status },
    });

    // Notificare live pentru schimbarea de status
    this.eventsGateway.server.emit('cardStatusChanged', updatedCard);
    return updatedCard;
  }

  async remove(id: number) {
    const deletedCard = await this.prisma.card.delete({
      where: { id: Number(id) },
    });

    // Notificare live pentru ștergere
    this.eventsGateway.server.emit('cardDeleted', id);
    return deletedCard;
  }

  // Job de test pentru coadă (BullMQ)
  async testBull() {
    await this.cardQueue.add('test-job', {
      text: 'Salut, sunt un job de test!',
    });
    console.log('Job adăugat în coadă cu succes!');
  }
}
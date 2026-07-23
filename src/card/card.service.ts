import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq';;
import csvParser = require('csv-parser');
import { Readable } from 'stream';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events.gateway';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectQueue('card-queue') private cardQueue: Queue,
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

 async queueImport(fileBuffer: Buffer) {
    const results: any[] = [];
    await new Promise((resolve, reject) => {
      const stream = Readable.from(fileBuffer.toString());
      stream.pipe(csvParser({ separator: ',' })) 
        .on('data', (data) => {
          console.log("Rând detectat de parser:", data); 
          if (data.title) results.push(data);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (results.length > 0) {
      console.log(results);
      
      await this.cardQueue.add('import-batch', {
        cards: results,
        boardId: 1
      }, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000, 
        },
        removeOnComplete: true,
        removeOnFail: false,
      });

      return { message: "Import adăugat în coadă cu succes!" };
    } else {
      throw new Error("Nu s-au găsit date valide în CSV!");
    }
  }

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
    this.eventsGateway.server.emit('cardCreated', newCard);
    
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

    this.eventsGateway.server.emit('cardUpdated', updatedCard);
    return updatedCard;
  }

  async remove(id: number) {
    const deletedCard = await this.prisma.card.delete({
      where: { id: Number(id) },
    });

    this.eventsGateway.server.emit('cardDeleted', id);
    return deletedCard;
  }

  async updateStatus(id: number, status: string) {
    const cardActualizat = await this.prisma.card.update({
      where: { id: Number(id) },
      data: { status: status },
    });
    this.eventsGateway.server.emit('cardStatusChanged', cardActualizat);

    return cardActualizat;
  }

  async testBull() {
    await this.cardQueue.add('test-job', {
      text: 'Salut, sunt un job de test!',
    });
    console.log('Job adăugat în coadă cu succes!');
  }
}
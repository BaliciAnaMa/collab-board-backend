import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events.gateway';
import { getQueueToken } from '@nestjs/bullmq';

// Testul 1: Formatare nume (fără dependențe)
describe('CardService - Formatare nume', () => {
  let service: CardService;

  beforeEach(() => {
    service = new CardService(null as any, null as any, null as any);
  });

  it('verifică dacă numele cardului este formatat corect (litere mari + fără spații)', () => {
    const intrare = '   practica 2026   ';
    const rezultat = service.formatCardName(intrare);
    expect(rezultat).toBe('PRACTICA 2026');
  });

  it('verifică dacă funcționează și cu un cuvânt simplu', () => {
    const rezultat = service.formatCardName('test');
    expect(rezultat).toBe('TEST');
  });
});

// Testul 2: Logica de Import CSV și adăugare în coadă
describe('CardService - Import CSV', () => {
  let service: CardService;
  let queueMock: any;

  beforeEach(async () => {
    queueMock = {
      add: jest.fn().mockResolvedValue({ id: '1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        {
          provide: getQueueToken('card-queue'),
          useValue: queueMock,
        },
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: EventsGateway,
          useValue: { server: { emit: jest.fn() } },
        },
      ],
    }).compile();

    service = module.get<CardService>(CardService);
  });

  it('ar trebui să parseze fișierul CSV și să adauge job-ul în coadă', async () => {
    const csvBuffer = Buffer.from('title,status\nTask 1,TODO\nTask 2,DONE');

    const result = await service.queueImport(csvBuffer);

    expect(result).toEqual({ message: 'Import adăugat în coadă cu succes!' });
    expect(queueMock.add).toHaveBeenCalledTimes(1);
    expect(queueMock.add).toHaveBeenCalledWith(
      'import-batch',
      expect.objectContaining({
        cards: expect.arrayContaining([
          expect.objectContaining({ title: 'Task 1' }),
          expect.objectContaining({ title: 'Task 2' }),
        ]),
        boardId: 1,
      }),
      expect.any(Object),
    );
  });

  it('ar trebui să arunce o eroare dacă CSV-ul nu conține date valide', async () => {
    const emptyCsvBuffer = Buffer.from('title,status\n');

    await expect(service.queueImport(emptyCsvBuffer)).rejects.toThrow(
      'Nu s-au găsit date valide în CSV!',
    );
  });
});
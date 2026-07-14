import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Nu uita importul
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  // Injectăm prisma service pentru a putea vorbi cu baza de date
  constructor(private readonly prisma: PrismaService) {}

  // 1. Creăm un board nou, legat de un utilizator
  async create(userId: number, createBoardDto: CreateBoardDto) {
    return this.prisma.board.create({
      data: {
        title: createBoardDto.title,
        userId: userId, // Aici legăm board-ul de utilizator
      },
    });
  }

  // 2. Găsim toate board-urile unui anumit utilizator
  async findAll(userId: number) {
    return this.prisma.board.findMany({
      where: { userId: userId },
    });
  }

  // 3. Găsim un board după ID
  async findOne(id: number) {
    return this.prisma.board.findUnique({
      where: { id: id },
    });
  }

  // 4. Modificăm titlul unui board
  async update(id: number, updateBoardDto: UpdateBoardDto) {
    return this.prisma.board.update({
      where: { id: id },
      data: { title: updateBoardDto.title },
    });
  }

  // 5. Ștergem un board
  async remove(id: number) {
    return this.prisma.board.delete({
      where: { id: id },
    });
  }
}
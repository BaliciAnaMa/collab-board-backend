import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseInterceptors, UploadedFile, UseGuards 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  // --- Import CSV ---
  @Post('import')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error("Nu ai încărcat niciun fișier!");
    return await this.cardService.queueImport(file.buffer);
  }

  // --- CRUD Carduri ---
  @Post(':boardId')
  @UseGuards(JwtAuthGuard)
  create(@Param('boardId') boardId: string, @Body() createCardDto: CreateCardDto) {
    return this.cardService.create(+boardId, createCardDto);
  }

  @Get('board/:boardId')
  @UseGuards(JwtAuthGuard)
  findAllByBoard(@Param('boardId') boardId: string) {
    return this.cardService.findAll(+boardId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+id, updateCardDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.cardService.remove(+id);
  }

  // --- Status & Redis ---
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async schimbaStatusul(@Param('id') id: string, @Body('status') status: string) {
    return this.cardService.updateStatus(Number(id), status);
  }

  @Get('test-redis')
  async testRedis() {
    await this.cardService.testBull();
    return { message: "Conexiunea cu controller-ul ok!" };
  }
}
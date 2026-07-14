import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('card') 
export class CardController {
  constructor(private readonly cardService: CardService) {}
  @Post(':boardId') 
  create(@Param('boardId') boardId: string, @Body() createCardDto: CreateCardDto) {
    return this.cardService.create(+boardId, createCardDto);
  }
  @Get('board/:boardId') 
  findAllByBoard(@Param('boardId') boardId: string) {
    return this.cardService.findAll(+boardId);
  }
  
  @Get('test-redis')
  async testRedis() {
    await this.cardService.testBull();
    return { message: "Conexiunea cu controller-ul ok!" };
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+id, updateCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardService.remove(+id);
  }
}
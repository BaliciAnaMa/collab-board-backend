import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('board')
@UseGuards(AuthGuard('jwt')) // Protejăm toate rutele din acest controller
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(@Request() req, @Body() createBoardDto: CreateBoardDto) {
    // req.user este pus automat de JwtStrategy
    return this.boardService.create(req.user.userId, createBoardDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.boardService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(+id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }
}
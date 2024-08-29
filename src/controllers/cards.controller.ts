import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { sendResponse } from 'src/common/set-res-header';
import { CreateCardDTO } from 'src/dtos/create-card.dto';
import { CardEntity } from 'src/entities/card.entity';
import { Protected } from 'src/guards/auth.guard';
import { CardsService } from 'src/services/cards-service';

@ApiTags('cards')
@ApiBearerAuth()
@Controller('users/:userId/columns/:columnId/cards')
export class CardsController {
  @Inject()
  private readonly cardsService: CardsService;

  @ApiOperation({ summary: 'Get card by id' })
  @Get(':cardId')
  async card(@Param('cardId') id: string): Promise<CardEntity> {
    return await this.cardsService.findById(id);
  }

  @ApiOperation({ summary: 'Get cards for column by id' })
  @Get()
  async cards(@Param('columnId') columnId: string): Promise<CardEntity[]> {
    return await this.cardsService.findByColumnId(columnId);
  }

  @ApiOperation({ summary: 'Delete card by id' })
  @Protected()
  @Delete(':cardId')
  async deleteCard(@Param('cardId') id: string): Promise<CardEntity> {
    return await this.cardsService.deleteById(id);
  }

  @ApiOperation({ summary: 'Create card for column' })
  @Protected()
  @Post()
  async createCard(
    @Body() dto: CreateCardDTO,
    @Param('columnId') columnId: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const newCard = await this.cardsService.save(dto, columnId, undefined);
    sendResponse(req, res, newCard.id);
  }

  @ApiOperation({ summary: 'Update card' })
  @Protected()
  @Put(':cardId')
  async updateColumn(
    @Body() dto: CreateCardDTO,
    @Param('columnId') columnId: string,
    @Param('cardId') cardId: string,
  ): Promise<CardEntity> {
    return await this.cardsService.save(dto, columnId, cardId);
  }
}

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
import { CreateColumnDTO } from 'src/dtos/create-column.dto';
import { ColumnEntity } from 'src/entities/column.entity';
import { Protected } from 'src/guards/auth.guard';
import { ColumnsService } from 'src/services/columns-service';

@ApiTags('columns')
@ApiBearerAuth()
@Controller('users/:userId/columns')
export class ColumnsController {
  @Inject()
  private readonly columnsService: ColumnsService;

  @ApiOperation({ summary: 'Get column by id' })
  @Get(':columnId')
  async column(@Param('columnId') id: string): Promise<ColumnEntity> {
    return await this.columnsService.findById(id);
  }

  @ApiOperation({ summary: 'Get all columns for user by id' })
  @Get()
  async columns(@Param('userId') userId: string): Promise<ColumnEntity[]> {
    return await this.columnsService.findByUserId(userId);
  }

  @ApiOperation({ summary: 'Delete column by id' })
  @Protected()
  @Delete(':columnId')
  async deleteColumn(@Param('columnId') id: string): Promise<ColumnEntity> {
    return await this.columnsService.deleteById(id);
  }

  @ApiOperation({ summary: 'Create column for user' })
  @Protected()
  @Post()
  async createColumn(
    @Body() dto: CreateColumnDTO,
    @Param('userId') userId: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const newColumn = await this.columnsService.save(dto, userId, undefined);
    sendResponse(req, res, newColumn.id);
  }

  @ApiOperation({ summary: 'Update column' })
  @Protected()
  @Put(':columnId')
  async updateColumn(
    @Body() dto: CreateColumnDTO,
    @Param('userId') userId: string,
    @Param('columnId') columnId: string,
  ): Promise<ColumnEntity> {
    return await this.columnsService.save(dto, userId, columnId);
  }
}

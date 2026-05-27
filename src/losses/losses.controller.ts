import { Controller, Get, Post, Body } from '@nestjs/common';

import { LossesService } from './losses.service';

import { CreateLossDto } from './dto/create-loss.dto';

@Controller('losses')
export class LossesController {
  constructor(private readonly lossesService: LossesService) {}

  @Post()
  create(@Body() createLossDto: CreateLossDto) {
    return this.lossesService.create(createLossDto);
  }

  @Get()
  findAll() {
    return this.lossesService.findAll();
  }
}
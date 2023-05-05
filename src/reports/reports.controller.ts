import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('reports')
export class ReportsController {
  @Post()
  create() {
    return 'This action creates a new report';
  }

  @Get()
  findAll() {
    return 'This action returns all reports';
  }

  @Get(':id')
  findOne() {
    return 'This action returns a #${id} report';
  }

  @Patch(':id')
  update() {
    return 'This action updates a #${id} report';
  }

  @Delete(':id')
  remove() {
    return 'This action removes a #${id} report';
  }
}

import { AuthGuard } from '@/auth/guard/auth.guard';
import { CurrentUserInterceptor } from '@/users/interceptor/current-user.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReportsService } from '@/reports/reports.service';
import { Serialize } from '@/interceptor/serialize.interceptor';
import { User } from '@/entities';
import { currentUser } from '@/users/decorator/current-user.decorator';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportDto } from '@/reports/dto/report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post()
  @Serialize(ReportDto)
  @UseInterceptors(CurrentUserInterceptor)
  @UseGuards(AuthGuard)
  create(@Body() createReportDto: CreateReportDto, @currentUser() user: User) {
    return this.reportService.create(createReportDto, user);
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

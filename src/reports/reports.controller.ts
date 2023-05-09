import { AuthGuard } from '@/guard/auth.guard';
import { CurrentUserInterceptor } from '@/users/interceptor/current-user.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { ApproveReportDto } from './dto/approve-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) { }

  @Post()
  @Serialize(ReportDto)
  @UseInterceptors(CurrentUserInterceptor)
  @UseGuards(AuthGuard)
  create(@Body() createReportDto: CreateReportDto, @currentUser() user: User) {
    return this.reportService.create(createReportDto, user);
  }

  @Get()
  findAll() {
    return this.reportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateReportDto: any) {
    return this.reportService.update(id, updateReportDto);
  }

  @Patch(':id/approved')
  approveReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() approvedDto: ApproveReportDto,
  ) {
    return this.reportService.changeApprovedStatus(id, approvedDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.remove(id);
  }
}

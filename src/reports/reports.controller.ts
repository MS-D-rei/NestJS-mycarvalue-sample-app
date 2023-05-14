import { AuthGuard } from '@/guard/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from '@/reports/reports.service';
import { Serialize } from '@/interceptor/serialize.interceptor';
import { User } from '@/entities';
import { currentUser } from '@/users/decorator/current-user.decorator';
import {
  ApproveReportDto,
  CreateReportDto,
  ReportDto,
  GetEstimateDto,
} from '@/reports/dto';
import { AdminGuard } from '@/guard/admin.guard';

// Module level
// CurrentUserMiddleware

@Serialize(ReportDto)
@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createReportDto: CreateReportDto, @currentUser() user: User) {
    return this.reportService.create(createReportDto, user);
  }

  @Get()
  findAll() {
    return this.reportService.findAll();
  }

  @Get('estimate')
  getEstimate(@Query() getEstimateDto: GetEstimateDto) {
    return this.reportService.createEstimate(getEstimateDto);
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
  @UseGuards(AdminGuard)
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

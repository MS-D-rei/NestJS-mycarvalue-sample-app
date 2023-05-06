import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '@/entities';
import { CreateReportDto } from '@/reports/dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  create(createReportDto: CreateReportDto) {
    const report = this.reportsRepository.create(createReportDto);
    return this.reportsRepository.save(report);
  }

  findAll() {
    return this.reportsRepository.find();
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.reportsRepository.findOneBy({ id });
  }

  async pdate(id: number, data: Partial<Report>) {
    const report = await this.reportsRepository.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    const updatedReport = { ...report, ...data };
    return this.reportsRepository.save(updatedReport);
  }

  async remove(id: number) {
    const report = await this.reportsRepository.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return this.reportsRepository.remove(report);
  }
}

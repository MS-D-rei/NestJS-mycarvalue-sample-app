import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, User } from '@/entities';
import { CreateReportDto } from '@/reports/dto/create-report.dto';
import { ApproveReportDto } from './dto/approve-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) { }

  create(createReportDto: CreateReportDto, user: User) {
    const report = this.reportsRepository.create(createReportDto);
    report.user = user;
    return this.reportsRepository.save(report);
  }

  async findAll() {
    const reports = await this.reportsRepository.find();
    if (!reports) {
      throw new NotFoundException('Reports not found');
    }
    return reports;
  }

  async findOne(id: number) {
    if (!id) {
      return null;
    }
    const report = await this.reportsRepository.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }

  async update(id: number, data: Partial<Report>) {
    const report = await this.reportsRepository.findOneBy({ id });
    if (!report) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }
    const updatedReport = { ...report, ...data };
    return this.reportsRepository.save(updatedReport);
  }

  async remove(id: number) {
    const report = await this.reportsRepository.findOneBy({ id });
    if (!report) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }
    return this.reportsRepository.remove(report);
  }

  async changeApprovedStatus(id: number, approveReportDto: ApproveReportDto) {
    const report = await this.reportsRepository.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = approveReportDto.approved;
    return this.reportsRepository.save(report);
  }
}

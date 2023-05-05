import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '@/reports/reports.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  create() {
    return 'This action creates a new report';
  }

  findAll() {
    return 'This action returns all reports';
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}

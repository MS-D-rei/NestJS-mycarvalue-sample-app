import { Expose } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  longitude: number;

  @Expose()
  latitude: number;

  @Expose()
  mileage: number;
}

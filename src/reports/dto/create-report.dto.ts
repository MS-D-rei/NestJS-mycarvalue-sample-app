import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  title: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(2023)
  year: number;

  @IsLongitude()
  longitude: number;

  @IsLatitude()
  latitude: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;
}

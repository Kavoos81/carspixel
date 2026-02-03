import { IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateCarDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  brand: string;

  @IsInt()
  @Min(1900)
  year: number;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  published?: boolean;
}

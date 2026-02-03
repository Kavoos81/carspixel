import { IsBoolean, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CreateArticleDto {
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "slug باید انگلیسی و kebab-case باشد (مثل: my-first-article)",
  })
  slug: string;

  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsString()
  @MinLength(20)
  content: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

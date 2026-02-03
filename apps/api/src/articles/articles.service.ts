import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  list(publishedOnly = true) {
    return this.prisma.article.findMany({
      where: publishedOnly ? { published: true } : {},
      orderBy: { createdAt: "desc" },
    });
  }

  async getBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article) throw new NotFoundException("مقاله پیدا نشد");
    return article;
  }

  async create(dto: CreateArticleDto) {
    try {
      return await this.prisma.article.create({ data: dto });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("این slug قبلاً استفاده شده است");
      }
      throw e;
    }
  }

  async update(id: string, dto: UpdateArticleDto) {
    try {
      return await this.prisma.article.update({ where: { id }, data: dto });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        throw new NotFoundException("مقاله پیدا نشد");
      }
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("این slug قبلاً استفاده شده است");
      }
      throw e;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.article.delete({ where: { id } });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        throw new NotFoundException("مقاله پیدا نشد");
      }
      throw e;
    }
  }
}

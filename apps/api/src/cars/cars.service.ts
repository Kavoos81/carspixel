import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCarDto } from "./dto/create-car.dto";
import { UpdateCarDto } from "./dto/update-car.dto";

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  list(publishedOnly = true) {
    return this.prisma.car.findMany({
      where: publishedOnly ? { published: true } : {},
      orderBy: { createdAt: "desc" },
    });
  }

  getBySlug(slug: string) {
    return this.prisma.car.findUnique({ where: { slug } });
  }

  create(dto: CreateCarDto) {
    return this.prisma.car.create({ data: dto });
  }

  update(id: string, dto: UpdateCarDto) {
    return this.prisma.car.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.car.delete({ where: { id } });
  }
}

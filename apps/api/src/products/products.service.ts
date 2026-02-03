import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAllPublished() {
    return this.prisma.product.findMany({
      where: { published: true },
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
    });
  }

  findAllAdmin() {
    return this.prisma.product.findMany({
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: { images: true, category: true },
    });
  }

  create(data: {
    slug: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    published?: boolean;
    categoryId?: string | null;
    images?: { url: string }[];
  }) {
    const { images, ...rest } = data;

    return this.prisma.product.create({
      data: {
        ...rest,
        images: images?.length
          ? { create: images.map((i) => ({ url: i.url })) }
          : undefined,
      },
      include: { images: true, category: true },
    });
  }

  update(
    id: string,
    data: Partial<{
      slug: string;
      title: string;
      description: string;
      price: number;
      stock: number;
      published: boolean;
      categoryId: string | null;
      coverImage: string | null; // اگر بعداً اضافه کردی
      images: { url: string }[];
    }>
  ) {
    // برای سادگی: اگر images فرستادی، کل images قبلی پاک میشه و جدیدها ست میشه
    const images = (data as any).images as { url: string }[] | undefined;
    const rest: any = { ...data };
    delete rest.images;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(images
          ? {
              images: {
                deleteMany: {},
                create: images.map((i) => ({ url: i.url })),
              },
            }
          : {}),
      },
      include: { images: true, category: true },
    });
  }

  remove(id: string) {
    // به خاطر relation بهتره اول images پاک بشن
    return this.prisma.product.delete({ where: { id } });
  }
}

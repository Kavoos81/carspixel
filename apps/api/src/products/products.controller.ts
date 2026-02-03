import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("products")
export class ProductsController {
  constructor(private products: ProductsService) {}

  // Public: فقط محصولات منتشرشده
  // Admin: با ?all=1 همه محصولات
  @Get()
  async list(@Query("all") all?: string) {
    return all ? this.products.findAllAdmin() : this.products.findAllPublished();
  }

  // Public: جزئیات محصول با slug
  @Get(":slug")
  async bySlug(@Param("slug") slug: string) {
    const product = await this.products.findBySlug(slug);
    if (!product) throw new NotFoundException("محصول یافت نشد");
    if (!product.published) throw new NotFoundException("محصول یافت نشد");
    return product;
  }

  // Admin: create
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) {
    return this.products.create({
      slug: body.slug,
      title: body.title,
      description: body.description,
      price: Number(body.price),
      stock: Number(body.stock ?? 0),
      published: Boolean(body.published ?? false),
      categoryId: body.categoryId ?? null,
      images: Array.isArray(body.images) ? body.images : [],
    });
  }

  // Admin: update
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() body: any) {
    const data: any = { ...body };
    if (data.price !== undefined) data.price = Number(data.price);
    if (data.stock !== undefined) data.stock = Number(data.stock);
    return this.products.update(id, data);
  }

  // Admin: delete
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.products.remove(id);
  }
}

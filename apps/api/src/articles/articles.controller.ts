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
} from "@nestjs/common";

import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("articles")
export class ArticlesController {
  constructor(private articles: ArticlesService) {}

  // ✅ Public list (published only by default)
  @Get()
  list(@Query("all") all?: string) {
    return this.articles.list(all === "1" ? false : true);
  }

  // ✅ Public detail by slug
  @Get(":slug")
  get(@Param("slug") slug: string) {
    return this.articles.getBySlug(slug);
  }

  // 🔒 Admin/Editor create
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR")
  create(@Body() dto: CreateArticleDto) {
    return this.articles.create(dto);
  }

  // 🔒 Admin/Editor update
  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR")
  update(@Param("id") id: string, @Body() dto: UpdateArticleDto) {
    return this.articles.update(id, dto);
  }

  // 🔒 Admin delete
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  remove(@Param("id") id: string) {
    return this.articles.remove(id);
  }
}

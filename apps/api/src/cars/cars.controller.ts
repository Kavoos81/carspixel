import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CarsService } from "./cars.service";
import { CreateCarDto } from "./dto/create-car.dto";
import { UpdateCarDto } from "./dto/update-car.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("cars")
export class CarsController {
  constructor(private cars: CarsService) {}

  // Public list (published only by default)
  @Get()
  list(@Query("all") all?: string) {
    return this.cars.list(all === "1" ? false : true);
  }

  // Public detail by slug
  @Get(":slug")
  get(@Param("slug") slug: string) {
    return this.cars.getBySlug(slug);
  }

  // Admin/Editor CRUD
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR")
  create(@Body() dto: CreateCarDto) {
    return this.cars.create(dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR")
  update(@Param("id") id: string, @Body() dto: UpdateCarDto) {
    return this.cars.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  remove(@Param("id") id: string) {
    return this.cars.remove(id);
  }
}

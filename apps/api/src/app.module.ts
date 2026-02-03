import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { CarsModule } from './cars/cars.module';
import { ArticlesModule } from './articles/articles.module';
import { MediaModule } from './media/media.module';
import { ProductsModule } from './products/products.module';



@Module({
  imports: [PrismaModule, UsersModule, AuthModule, CarsModule, ArticlesModule, MediaModule, ProductsModule],
})
export class AppModule {}

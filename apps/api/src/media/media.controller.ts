import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

function safeFileName(originalName: string) {
  const ext = extname(originalName).toLowerCase();
  const allowed = new Set([".jpg", ".jpeg", ".png", ".webp"]);
  if (!allowed.has(ext)) throw new BadRequestException("فقط jpg/png/webp مجاز است");
  const rand = Math.random().toString(16).slice(2);
  return `cover-${Date.now()}-${rand}${ext}`;
}

@Controller("media")
export class MediaController {
  @Post("upload")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "uploads",
        filename: (_req, file, cb) => {
          try {
            cb(null, safeFileName(file.originalname));
          } catch (e: any) {
            cb(e, "");
          }
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException("فایل ارسال نشده است");

    // URL public
    const url = `http://localhost:3001/uploads/${file.filename}`;
    return { url, filename: file.filename };
  }
}

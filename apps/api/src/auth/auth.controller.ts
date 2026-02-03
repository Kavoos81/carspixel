import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

import { JwtAuthGuard } from "./jwt-auth.guard";
import { RolesGuard } from "./roles.guard";
import { Roles } from "./roles.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // ------------------------
  // Register
  // POST /auth/register
  // ------------------------
  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password, dto.name);
  }

  // ------------------------
  // Login
  // POST /auth/login
  // ------------------------
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  // ------------------------
  // Current user (JWT protected)
  // GET /auth/me
  // ------------------------
  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return req.user;
  }

  // ------------------------
  // Admin only test route
  // GET /auth/admin-only
  // ------------------------
  @Get("admin-only")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  adminOnly() {
    return { ok: true, message: "Welcome Admin 👑" };
  }
}

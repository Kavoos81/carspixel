import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string, name?: string) {
    const exists = await this.users.findByEmail(email);
    if (exists) throw new BadRequestException("ایمیل قبلاً ثبت شده است");

    const hash = await bcrypt.hash(password, 12);
    const user = await this.users.create({ email, password: hash, name });

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException("ایمیل یا رمز اشتباه است");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException("ایمیل یا رمز اشتباه است");

    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      role: user.role,
      email: user.email,
    });

    return { accessToken };
  }
}

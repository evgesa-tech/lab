import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Роль из запроса не принимаем: иначе любой зарегистрируется администратором.
  // Администратор создаётся сидом (npx prisma db seed).
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existing) {
      throw new BadRequestException(
        'Пользователь с таким username уже существует',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const roleName = 'user';

    const savedUser = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        roles: {
          connectOrCreate: {
            where: { name: roleName },
            create: { name: roleName },
          },
        },
      },
      include: { roles: true },
    });

    const { password, ...result } = savedUser;
    return result;
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { roles: true },
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const roles = user.roles ? user.roles.map((r: any) => r.name) : [];
    const payload = { username: user.username, sub: user.id, roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

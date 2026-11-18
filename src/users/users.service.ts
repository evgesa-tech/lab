import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

export const publicUserSelect = {
  id: true,
  username: true,
  email: true,
  roles: { select: { name: true } },
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    try {
      // Хешируем пароль перед сохранением в базу данных
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      return await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hashedPassword, // сохраняем хэш вместо чистого пароля
          roles: {
            connect: { name: 'user' }, // связываем с ролью по умолчанию
          },
        },
        select: publicUserSelect,
      });
    } catch (e: any) {
      if (e?.code === 'P2002') {
        throw new BadRequestException(
          'Пользователь с таким username или email уже существует',
        );
      }
      throw e;
    }
  }

  getAllUsers() {
    return this.prisma.user.findMany({ select: publicUserSelect });
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { ...publicUserSelect, tasks: true },
    });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    return user;
  }
}
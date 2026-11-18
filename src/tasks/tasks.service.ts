import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { publicUserSelect } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(dto: CreateTaskDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${dto.userId} не найден`);
    }

    return await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        userId: dto.userId,
      },
    });
  }

  async getTasksByUser(userId: number) {
    return await this.prisma.task.findMany({
      where: { userId },
    });
  }

  async getAllTasks() {
    return await this.prisma.task.findMany({
      include: { user: { select: publicUserSelect } },
    });
  }

  async getTaskById(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { user: { select: publicUserSelect } },
    });
    if (!task) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }
    return task;
  }

  async updateTask(id: number, dto: UpdateTaskDto) {
    await this.getTaskById(id);
    return await this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async deleteTask(id: number) {
    await this.getTaskById(id);
    await this.prisma.task.delete({
      where: { id },
    });
  }
}

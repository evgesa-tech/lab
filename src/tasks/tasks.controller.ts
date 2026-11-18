import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Get('user/:userId')
  getTasksByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.tasksService.getTasksByUser(userId);
  }

  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Put(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('administrator')
  @Delete(':id')
  @HttpCode(204)
  async deleteTask(@Param('id', ParseIntPipe) id: number) {
    await this.tasksService.deleteTask(id);
  }
}

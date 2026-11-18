import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

// @Module({
//   imports: [TypeOrmModule.forFeature([Task, User])],
//   controllers: [TasksController],
//   providers: [TasksService],
// })
@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}

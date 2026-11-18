import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

// imports: [
//   TypeOrmModule.forRoot({
//     type: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     username: 'postgres',
//     password: 'postgres',
//     database: 'postgres',
//     entities: [Task],
//     synchronize: true,
//   }),
//   TasksModule,
// ],
@Module({
  imports: [PrismaModule, TasksModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

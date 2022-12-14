import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository])], //For injecting dependency anywhere we need it in the module
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
})
export class TasksModule {}

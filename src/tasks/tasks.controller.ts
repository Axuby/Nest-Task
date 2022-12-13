import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
    } else {
      return this.taskService.getAllTasks();
    }
  }
  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }
  @Post()
  createTask(
    @Body() createTaskdto: CreateTaskDto,
    // @Body('title') title: string,
    // @Body('description') description: string,
  ): Task {
    console.log('Ok');
    return this.taskService.createTask(createTaskdto);
  }
  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): void {
    return this.taskService.deleteTaskById(id);
  }
  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body('status') updateTaskDto: UpdateTaskDto,
  ): Task {
      const { status } = updateTaskDto;
    return this.taskService.updateTask(id, status);
  }
}

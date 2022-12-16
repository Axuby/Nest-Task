import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity'
import { GetUser } from 'src/auth/get-user.decorator'
import { TaskStatus } from './tasks-status.enum';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskService.getTasks(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.taskService.getTaskById(id);
  }
  // @Get('/:id')
  // getTaskById(@Param('id') id: string): Task {
  //   return this.taskService.getTaskById(id);
  // }
  @Post()
  createTask(
    @Body() createTaskdto: CreateTaskDto,
    @GetUser() user:User,
    // @Body('title') title: string,
    // @Body('description') description: string,
  ): Promise<Task> {
    console.log('Ok');
    return this.taskService.createTask(createTaskdto,user);
  }
  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): Promise<void> {
    return this.taskService.deleteTaskById(id);
  }
  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body('status') updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const { status } = updateTaskDto;
    return this.taskService.updateTask(id, status);
  }
}

// @Get()
// getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
//   if (Object.keys(filterDto).length) {
//   } else {
//     return this.taskService.getAllTasks();
//   }
// }

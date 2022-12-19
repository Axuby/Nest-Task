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
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { TaskStatus } from './tasks-status.enum';
import { TasksService } from './tasks.service';
import { ConfigService } from '@nestjs/config';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController');

  constructor(
    private taskService: TasksService,

  ) {

  }

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User ${user.username} retrieving all tasks.Filters are ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }
  // @Get('/:id')
  // getTaskById(@Param('id') id: string): Task {
  //   return this.taskService.getTaskById(id);
  // }
  @Post()
  createTask(
    @Body() createTaskdto: CreateTaskDto,
    @GetUser() user: User,
    // @Body('title') title: string,
    // @Body('description') description: string,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} creating a new Task.Data is ${JSON.stringify(
        createTaskdto,
      )}`,
    );
    return this.taskService.createTask(createTaskdto, user);
  }
  @Delete('/:id')
  deleteTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.taskService.deleteTaskById(id, user);
  }
  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body('status') updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskDto;
    return this.taskService.updateTask(id, status, user);
  }
}

// @Get()
// getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
//   if (Object.keys(filterDto).length) {
//   } else {
//     return this.taskService.getAllTasks();
//   }
// }

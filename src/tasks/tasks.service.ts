import { Injectable } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundException } from '@nestjs/common/exceptions';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import {User} from 'src/auth/user.entity'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  createTask(createTaskdto: CreateTaskDto,user:User): Promise<Task> {
    return this.taskRepository.createTask(createTaskdto,user);
  }
  // createTask(createTaskdto: CreateTaskDto): Task {
  //   const { title, description } = createTaskdto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   console.log(task);
  //   return task;
  // }

  async getTaskById(id: string): Promise<Task> {
    let task;
    try {
      task = await this.taskRepository.findOne({ where: { id } });
      return task;
    } catch (error) {
      console.log(error.code);
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
    }
    console.log('here');
  }
  // getTaskById(id: string): Task {
  //   const task = this.tasks.find((obj) => obj.id == id);
  //   if (!task) throw new NotFoundException(`Task with ${id} not found`);
  //   return task;
  // }
  async deleteTaskById(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // this.tasks = this.tasks.filter((task) => task.id != id);
    // // const index = this.tasks.findIndex((obj) => obj.id == id);
    // // this.tasks.splice(index);
    // return;
  }
  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    console.log('Update');
    const task = await this.getTaskById(id);
    task.status = status;
    try {
      await this.taskRepository.save(task);
    } catch (error) {
      console.log(error.code)
    }
    return task;
  }
}
// private tasks: Task[] = [];

// getAllTasks(): Task[] {
//   return this.tasks;
// }

// getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
//   const { status, search } = filterDto;

//   let tasks = this.tasks;
//   if (status) {
//     tasks = tasks.filter((task) => task.status === status);
//   }
//   if (search) {
//     tasks = tasks.filter(
//       (task) =>
//         task.title.includes(search.toLowerCase()) ||
//         task.description.includes(search.toLowerCase()),
//     );
//   }
//   return tasks;
// }

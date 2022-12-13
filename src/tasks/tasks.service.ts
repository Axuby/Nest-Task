import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.tasks;
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search.toLowerCase()) ||
          task.description.includes(search.toLowerCase()),
      );
    }
    return tasks;
  }

  createTask(createTaskdto: CreateTaskDto): Task {
    const { title, description } = createTaskdto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    console.log(task);
    return task;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((obj) => obj.id == id);
    if (!task) throw new NotFoundException(`Task with ${id} not found`);
    return task;
  }
  deleteTaskById(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id != id);
    // const index = this.tasks.findIndex((obj) => obj.id == id);
    // this.tasks.splice(index);
    return;
  }
  updateTask(id: string, status: TaskStatus): Task {
      const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}

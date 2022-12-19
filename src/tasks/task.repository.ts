// import { EntityRepository, Repository } from 'typeorm';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
// import { Task } from './task.entity';
// import { TaskStatus } from './tasks-status.enum';

// @EntityRepository(Task)
// export class TaskRepository extends Repository<Task> {
//   async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
//     const { status, search } = filterDto;
//     const query = this.createQueryBuilder('task');

//     if (status) {
//       query.andWhere('task.status = :status', { status: 'OPEN' });
//     }
//     if (search) {
//       query.andWhere(
//         'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
//         { search: `%${search}%` },
//       );
//     }

//     const tasks = await query.getMany();
//     return tasks;
//   }

//   async createTask({ title, description }: CreateTaskDto): Promise<Task> {
//     console.log(this);
//     const task = this.create({
//       title,
//       description,
//       status: TaskStatus.OPEN,
//     });

//     await this.save(task);
//     return task;
//   }
//}

import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
import { Logger } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';

@Injectable()
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository', { timestamp: true });
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status: 'OPEN' });
    }
    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      this.logger.verbose(`Tasks: ${tasks.length}`);
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user ${user.username}`,
        error.stack,
      );
      throw new InternalServerErrorException('An Error Occurred');
    }
  }

  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    // console.log(this);
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);
    return task;
  }
}

// export const TaskRepository = dataSource.getRepository(User).extend({
//   findByName(firstName: string, lastName: string) {
//     return this.createQueryBuilder('user')
//       .where('user.firstName = :firstName', { firstName })
//       .andWhere('user.lastName = :lastName', { lastName })
//       .getMany();
//   },
// });

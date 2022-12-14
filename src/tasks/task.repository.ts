import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './tasks-status.enum';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status: 'OPEN' });
    }
    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask({ title, description }: CreateTaskDto): Promise<Task> {
    console.log(this);
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }
}

// import { Injectable } from '@nestjs/common';
// import { DataSource, Repository } from 'typeorm';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { TaskStatus } from './tasks-status.enum';
// import { Task } from './task.entity';

// @Injectable()
// export class TaskRepository extends Repository<Task> {
//   constructor(private dataSource: DataSource) {
//     super(Task, dataSource.createEntityManager());
//   }

// }

// export const TaskRepository = dataSource.getRepository(User).extend({
//   findByName(firstName: string, lastName: string) {
//     return this.createQueryBuilder('user')
//       .where('user.firstName = :firstName', { firstName })
//       .andWhere('user.lastName = :lastName', { lastName })
//       .getMany();
//   },
// });

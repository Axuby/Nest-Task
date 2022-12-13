import { TaskStatus } from '../tasks.model';
import { IsEnum } from 'class-validator';

export class UpdateTaskDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

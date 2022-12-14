import { TaskStatus } from '../tasks-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateTaskDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

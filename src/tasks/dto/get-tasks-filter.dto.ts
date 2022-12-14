import { TaskStatus } from '../tasks-status.enum';
import { IsEnum, IsString, IsOptional } from 'class-validator';
// eslint-disable-next-line prettier/prettier

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}

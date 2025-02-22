import { Controller, Get, Post, Param, Body, Put, Delete, Patch } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.schema';
import { Subtask } from './subtask.schema';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  create(@Body() createTaskDto: { title: string; description: string; dueDate: Date; priority: number }): Promise<Task> {
    return this.taskService.createTask(createTaskDto.title, createTaskDto.description, createTaskDto.dueDate, createTaskDto.priority);
  }

  @Get()
  getAll(): Promise<Task[]> {
    return this.taskService.getAllTasks();
  }

  @Get(':id/subtask')
  getAllSubTasks(@Param('id') id: string): Promise<Subtask[]> {
    return this.taskService.getAllSubTasks(id);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: { title: string; description: string; dueDate: Date; priority: number }): Promise<Task> {
    return this.taskService.updateTask(id, updateTaskDto.title, updateTaskDto.description, updateTaskDto.dueDate, updateTaskDto.priority);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<any> {
    return this.taskService.deleteTask(id);
  }

  @Post(':id/subtask')
  addSubtask(@Param('id') taskId: string, @Body() createSubtaskDto: { title: string }): Promise<Subtask> {
    return this.taskService.addSubtask(taskId, createSubtaskDto.title);
  }

  @Patch(':id/subtask/:subtaskId')
  markSubtaskAsComplete(@Param('id') taskId: string, @Param('subtaskId') subtaskId: string): Promise<Subtask> {
    // console.log(taskId, subtaskId)
    return this.taskService.markSubtaskAsComplete(taskId, subtaskId);
  }

  @Get(':id/progress')
  getProgress(@Param('id') id: string): Promise<{ progress: number }> {
    return this.taskService.getProgress(id);
  }

  @Get('status/:status')
  filterByStatus(@Param('status') status: string): Promise<Task[]> {
    return this.taskService.filterTasksByStatus(status);
  }
}

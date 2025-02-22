import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';
import { Subtask } from './subtask.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task') private taskModel: Model<Task>,
    @InjectModel('Subtask') private subtaskModel: Model<Subtask>,
  ) { }

  async createTask(title: string, description: string, dueDate: Date, priority: number): Promise<Task> {
    const task = new this.taskModel({ title, description, dueDate, priority });
    return task.save();
  }

  async updateTask(id: string, title: string, description: string, dueDate: Date, priority: number): Promise<Task> {
    const task = await this.taskModel.findByIdAndUpdate(id, { title, description, dueDate, priority }, { new: true });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async deleteTask(id: string): Promise<any> {
    const task = await this.taskModel.findById(id).populate('subtasks').exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // delete subtasks
    this.subtaskModel.deleteMany({ _id: { $in: task.subtasks } }).lean().exec()
    return this.taskModel.findByIdAndDelete(id);
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskModel.find().populate('subtasks').exec();
  }

  async getAllSubTasks(id: string): Promise<Subtask[]> {
    const task = await this.taskModel.findById(id).populate('subtasks').lean().exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.subtaskModel.find({ task: id }).exec();
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).populate('subtasks').exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async markTaskAsComplete(id: string): Promise<Task | null> {
    const task = await this.taskModel.findByIdAndUpdate(id, { status: 'completed' }, { new: true });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async addSubtask(taskId: string, title: string): Promise<Subtask> {
    const task = await this.taskModel.findById(taskId).lean().exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const subtask = new this.subtaskModel({ title, task: taskId });
    await subtask.save();
    await this.taskModel.findByIdAndUpdate(taskId, { $push: { subtasks: subtask._id } });
    return subtask;
  }

  async markSubtaskAsComplete(taskId: string, subtaskId: string): Promise<Subtask> {
    const task = await this.taskModel.findById(taskId).populate('subtasks').lean().exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const subtask = await this.subtaskModel.findByIdAndUpdate(subtaskId, { status: 'completed' }, { new: true }).lean().exec();
    if (!subtask) {
      throw new NotFoundException('Subtask not found');
    }

    // complete task if all subtasks are completed
    // @ts-ignore
    const pendingSubtasks = task.subtasks.filter(subtask => subtask.status === 'pending').length;
    if (pendingSubtasks == 0) {
      await this.taskModel.findByIdAndUpdate(taskId, { status: 'completed' }, { new: true }).lean().exec();
    }

    return subtask;
  }

  async getProgress(taskId: string): Promise<{ progress: number }> {
    const task = await this.taskModel.findById(taskId).populate('subtasks').exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const totalSubtasks = task.subtasks.length;
    // @ts-ignore
    const completedSubtasks = task.subtasks.filter(subtask => subtask.status === 'completed').length;
    return { progress: (completedSubtasks / totalSubtasks) * 100 };
  }

  async filterTasksByStatus(status: string): Promise<Task[]> {
    return this.taskModel.find({ status }).populate('subtasks').exec();
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskSchema } from './task.schema';
import { SubtaskSchema } from './subtask.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Task', schema: TaskSchema },
            { name: 'Subtask', schema: SubtaskSchema },
        ]),
    ],
    providers: [TaskService],
    controllers: [TaskController],
})
export class TaskModule { }

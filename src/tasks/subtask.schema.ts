import { Schema, Document } from 'mongoose';

export const SubtaskSchema = new Schema({
    title: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
});

export interface Subtask extends Document {
    title: string;
    status: string;
    task: string;  // ObjectId referencing the task
}

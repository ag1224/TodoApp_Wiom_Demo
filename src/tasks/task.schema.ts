import { Schema, Document } from 'mongoose';

export const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    dueDate: { type: Date, required: false },
    priority: { type: Number, default: 1 },
    subtasks: [{ type: Schema.Types.ObjectId, ref: 'Subtask' }],
});

export interface Task extends Document {
    title: string;
    description: string;
    status: string;
    dueDate: Date;
    priority: number;
    subtasks: string[];  // Array of ObjectIds referencing subtasks
}

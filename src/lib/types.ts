import { z } from 'zod';

export const TodoStatusSchema = z.enum(['done', 'pending']);

export const TodoSchema = z.object({
  id: z.string(),
  name: z.string(),
  dueDate: z.string(),
  status: TodoStatusSchema,
  created_at: z.string(),
});

export type Todo = z.infer<typeof TodoSchema>;
export type TodoStatus = z.infer<typeof TodoStatusSchema>;

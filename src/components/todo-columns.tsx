export type Todo = {
  id: string;
  name: string;
  dueDate: string;
  status: TodoStatus;
  created_at: string;
};

export type TodoStatus = 'done' | 'pending';

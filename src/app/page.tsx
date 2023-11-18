import AddTodoForm from '@/components/add-todo-form';
import TodoList from '@/components/todo-list';

export default function Home() {
  return (
    <main>
      <h1>To do list</h1>
      <AddTodoForm />
      <TodoList />
    </main>
  );
}

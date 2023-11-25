import AddTodoForm from '@/components/add-todo-form';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import TodoList from '@/components/todo-list';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/env.mjs';
import { Todo } from '@/components/todo-columns';

export default async function Home() {
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data: initialTodos, error: fetchInitialTodoError } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<Todo[]>();

  return (
    <main>
      <MaxWidthWrapper className="flex flex-col items-center justify-center text-center">
        <h1 className="font-cold text-4xl">To do list</h1>
        <AddTodoForm />
        <TodoList />
      </MaxWidthWrapper>
    </main>
  );
}

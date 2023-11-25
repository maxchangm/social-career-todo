import React from 'react';
import { Todo, columns } from './todo-columns';
import MaxWidthWrapper from './max-width-wrapper';
import TodoDataframe from './todo/data-table';
import { useAtom } from 'jotai';
interface ITodoListProps extends React.HTMLAttributes<HTMLDivElement> {
  initialTodos: Todo[];
  className?: string;
}

const TodoList = ({ initialTodos }: ITodoListProps) => {
  return (
    <MaxWidthWrapper className="z-0">
      <div>
        <TodoDataframe
          columns={columns}
          data={[
            {
              id: '1',
              name: 'Test',
              dueDate: '2021-10-10',
              status: false,
            },
            {
              id: '2',
              name: 'Test 2',
              dueDate: '2021-10-11',
              status: true,
            },
          ]}
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default TodoList;

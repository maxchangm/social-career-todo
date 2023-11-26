'use client';

import { todosAtom } from '@/atoms/todos';
import { ColumnDef } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { ArrowUpDown, Trash2 } from 'lucide-react';
import React from 'react';
import MaxWidthWrapper from './max-width-wrapper';
import { Todo } from './todo-columns';
import TodoDataframe from './todo-data-table/data-table';
import { statuses } from './todo-data-table/status-icons';
import { Checkbox } from './ui/checkbox';
import { Toggle } from './ui/toggle';

interface ITodoListProps extends React.HTMLAttributes<HTMLDivElement> {
  initialTodos?: Todo[];
  className?: string;
}

const TodoList = ({ initialTodos }: ITodoListProps) => {
  const [todoList, setTodoList] = useAtom(todosAtom);

  React.useEffect(() => {
    if (initialTodos) {
      setTodoList(initialTodos);
    }
  }, []);

  const columns = React.useMemo<ColumnDef<Todo>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row, table, column, getValue }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                return row.toggleSelected(!!value);
              }}
              aria-label="Select row"
            />
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Toggle
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Toggle>
          );
        },
        cell: ({ row }) => (
          <div
            className={`text-start lowercase ${
              row.getValue('status') === 'done' ? 'line-through' : ''
            }`}
          >
            {row.getValue('name')}
          </div>
        ),
      },
      {
        accessorKey: 'dueDate',
        header: ({ column }) => {
          return (
            <Toggle
              className="flex justify-start"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Due Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Toggle>
          );
        },
        cell: ({ row }) => {
          return (
            <div
              className={`left-0 ${
                row.getValue('status') === 'done' ? 'line-through' : ''
              }`}
            >
              {new Date(row.getValue('dueDate') as Date).toDateString()}
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = statuses.find(
            (status) => status.value === row.getValue('status')
          );

          if (!status) {
            return null;
          }

          return (
            <div className="flex w-[100px] items-center">
              {status.icon && (
                <status.icon
                  className={`mr-2 h-4 w-4 ${
                    row.getValue('status') === 'done'
                      ? 'text-green-500'
                      : 'text-muted-foreground'
                  }`}
                />
              )}
              <span>{status.label}</span>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const payment = row.original;

          return (
            <Toggle aria-label="Toggle italic">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Toggle>
          );
        },
      },
    ],
    []
  );

  return (
    <MaxWidthWrapper className="z-0">
      <div>
        <TodoDataframe
          columns={columns}
          data={todoList}
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default TodoList;

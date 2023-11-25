'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';

export type Todo = {
  id: string;
  name: string;
  dueDate: string;
  status: boolean;
};

export const columns: ColumnDef<Todo>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <div className="left-0">{row.getValue('name')}</div>;
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue('status') ? '✅' : '❌'}</div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex flex-row space-x-2">
          <button className="text-blue-500">Edit</button>
          <button className="text-red-500">Delete</button>
        </div>
      );
    },
  },
];

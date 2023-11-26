'use client';
import React from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
  Updater,
  VisibilityState,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Todo, TodoStatus } from '../todo-columns';
import { todosAtom } from '@/atoms/todos';
import { useAtom } from 'jotai';
import supabase from '@/lib/supabase';
import { DataTableToolbar } from './data-table-toolbar';
import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData extends Todo, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const TodoDataframe = <TData extends Todo, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [todoList, setTodoList] = useAtom(todosAtom);

  React.useEffect(() => {
    data.forEach((row, idx) => {
      if (row.status === 'done') {
        setRowSelection((prev) => ({ ...prev, [idx]: true }));
      }
    });
  }, [todoList]);

  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    enableSorting: true,
    enableFilters: true,
    onRowSelectionChange: (updaterOrValue: Updater<RowSelectionState>) => {
      console.log(typeof updaterOrValue);
      // Check if updaterOrValue is a function.
      const newRowSelection =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(rowSelection as RowSelectionState)
          : updaterOrValue;

      // Optimistically update state.
      setRowSelection(newRowSelection);

      const oldSelectedRowIds = Object.keys(rowSelection);
      const newSelectedRowIds = Object.keys(newRowSelection);

      const changedRowIds = [
        ...Array.from(new Set([...oldSelectedRowIds, ...newSelectedRowIds])),
      ].filter(
        (id) => newRowSelection[id] !== (rowSelection as RowSelectionState)[id]
      );

      console.log(changedRowIds);

      const changedIndex = parseInt(changedRowIds[0]);

      const newData = data.map((row, idx) => {
        if (idx === changedIndex) {
          // If the row's selection status has changed, toggle the status.
          return {
            ...row,
            status: row.status === 'done' ? 'pending' : ('done' as TodoStatus),
          };
        }
        return row;
      });

      // Optimistically update the data state.
      setTodoList(newData);

      // Update server.
      new Promise(async (resolve, reject) => {
        const { data, error } = await supabase
          .from('todos')
          .update({ status: newData[changedIndex].status })
          .eq('id', newData[changedIndex].id)
          .select();

        if (error) {
          reject(error);
        }
        resolve(data);
      }).catch((error) => {
        // If server update fails, rollback state and show error.
        setRowSelection(rowSelection);
        console.error('Failed to update payment details:', error);
      });
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border text-left">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};

export default TodoDataframe;

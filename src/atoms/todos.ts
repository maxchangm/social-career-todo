import { Todo } from '@/lib/types';
import { atom } from 'jotai';
import supabase from '@/lib/supabase';
import {
  ColumnFilter,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

export const todosAtom = atom<Todo[]>([]);
export const isConfettiVisibleAtom = atom(false);
export const sortingAtom = atom<SortingState>([]);
export const columnFiltersAtom = atom<ColumnFilter[]>([]);
export const columnVisibilityAtom = atom<VisibilityState>({});
export const rowSelectionAtom = atom({});

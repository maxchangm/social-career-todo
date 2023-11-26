import { Todo } from '@/components/todo-columns';
import { atom } from 'jotai';
import supabase from '@/lib/supabase';

export const todosAtom = atom<Todo[]>([]);
export const isConfettiVisibleAtom = atom(false);

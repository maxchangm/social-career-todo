import { Todo } from '@/components/todo-columns';
import { atom } from 'jotai';

export const todosAtom = atom<Todo[]>([]);

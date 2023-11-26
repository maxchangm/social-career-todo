'use client';
import { todosAtom } from '@/atoms/todos';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import supabase from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { useSetAtom } from 'jotai';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import MaxWidthWrapper from './max-width-wrapper';
import { Todo } from './todo-columns';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

const addTodoFormSchema = z.object({
  name: z
    .string({
      description: 'The name of the todo',
    })
    .min(1, {
      message: 'Please enter a name',
    }),
  dueDate: z.date({
    required_error: 'Please pick a date',
  }),
  status: z.enum(['pending', 'done']).default('pending'),
});

const AddTodoForm = () => {
  const { toast } = useToast();
  const setTodoList = useSetAtom(todosAtom);
  const form = useForm<z.infer<typeof addTodoFormSchema>>({
    resolver: zodResolver(addTodoFormSchema),
    defaultValues: {
      name: '',
      dueDate: undefined,
      status: 'pending',
    },
  });

  const handleFormSubmit = async (
    values: z.infer<typeof addTodoFormSchema>
  ) => {
    const { data: returnedTodo, error: InsertTodoError } = await supabase
      .from('todos')
      .insert({
        name: values.name,
        due_date: values.dueDate.toISOString(),
        status: values.status,
      })
      .select();

    if (InsertTodoError || returnedTodo === null) {
      console.error(InsertTodoError);
    } else {
      toast({
        title: 'Todo added',
        description: `${returnedTodo[0].name} has been added`,
        className: 'border-2 border-green-500',
      });
      setTodoList((prev) => [
        ...prev,
        {
          id: returnedTodo[0].id,
          name: returnedTodo[0].name,
          dueDate: returnedTodo[0].due_date,
          status: returnedTodo[0].status,
        } as Todo,
      ]);
    }

    form.reset();
  };
  return (
    <MaxWidthWrapper>
      <div className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className="flex w-full flex-row items-center justify-between">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-1/3 text-left">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Please enter a name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex h-full w-1/3 flex-col text-left">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal ',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              new Date(field.value).toDateString()
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 " />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="z-10 w-auto bg-secondary p-0"
                        align="start"
                      >
                        <Calendar
                          className=""
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={field.onChange}
                          disabled={(date: Date) => {
                            if (
                              date.toDateString() === new Date().toDateString()
                            ) {
                              return false;
                            }
                            return new Date() > date;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              variant={'default'}
              type="submit"
            >
              Save
            </Button>
          </form>
        </Form>
      </div>
    </MaxWidthWrapper>
  );
};

export default AddTodoForm;

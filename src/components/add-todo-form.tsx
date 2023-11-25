'use client';
import React from 'react';
import MaxWidthWrapper from './max-width-wrapper';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

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
  status: z.boolean().default(false),
});

const AddTodoForm = () => {
  const form = useForm<z.infer<typeof addTodoFormSchema>>({
    resolver: zodResolver(addTodoFormSchema),
    defaultValues: {
      name: '',
      dueDate: undefined,
      status: false,
    },
  });

  const handleFormSubmit = (values: z.infer<typeof addTodoFormSchema>) => {
    console.log({
      ...values,
      dueDate: values.dueDate.toDateString(),
    });

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

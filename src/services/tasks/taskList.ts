import { Context } from 'hono'

export const taskList = async (c: Context) => {
  const mockTask = [
    {
      id: 1,
      name: 'Task 1',
      slug: 'task-1',
      description: 'Description 1',
      completed: false,
      due_date: '2025-07-18T00:00:00.000Z',
    },
    {
      id: 2,
      name: 'Task 2',
      slug: 'task-2',
      description: 'Description 2',
      completed: false,
      due_date: '2025-07-18T00:00:00.000Z',
    },
  ]
  return c.json({
    task: mockTask,
  })
}


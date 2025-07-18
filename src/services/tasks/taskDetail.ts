import { Context } from 'vm'

export const taskDetail = async (c: Context) => {
  const taskId = c.req.param('id')
  const mockTask = {
    id: taskId,
    name: 'Task 1',
    slug: 'task-1',
    description: 'Description 1',
    completed: false,
    due_date: '2025-07-18T00:00:00.000Z',
  }
  return c.json({
    task: mockTask,
  })
}

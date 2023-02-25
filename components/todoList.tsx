import { useTodos } from '@/contexts/todo'
import { useCallback } from 'react'
import ListItem from './listItem'
import TodoListSkeleton from './todoListSkeleton'

export interface Todo {
  id: string
  title: string
  index: number
  done: boolean
}

export default function TodoList() {
  const { todos, loading } = useTodos()

  const renderListItem = useCallback((index: number, item: Todo) => {
    return <ListItem index={index} todo={item} key={item.id} />
  }, [])

  if (loading) return <TodoListSkeleton />

  if (!todos || !todos.length)
    return (
      <h3 className='text-center text-white text-xl mt-5'>
        No to do was found
      </h3>
    )

  return (
    <ul className='mx-auto mt-10 bg-white shadow-lg rounded-lg p-4 space-y-2'>
      {todos.map((item, index) => renderListItem(index, item))}
    </ul>
  )
}

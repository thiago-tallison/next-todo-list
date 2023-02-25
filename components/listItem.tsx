import { useTodos } from '@/contexts/todo'
import { useDrag, useDrop, XYCoord } from 'react-dnd'
import { FaRegTrashAlt } from 'react-icons/fa'
import { MdDragIndicator } from 'react-icons/md'
import { Identifier } from 'dnd-core'
import { Todo } from './todoList'
import { useCallback, useMemo, useRef } from 'react'

interface ListItemProps {
  todo: Todo
  index: number
}

export default function ListItem({ todo, index }: ListItemProps) {
  const ref = useRef<HTMLLIElement>(null)

  const { removeTodo, swapTodos, toglgeDone } = useTodos()

  const [{ isDragging }, drag] = useDrag({
    type: 'TODO',
    item: () => {
      return { id: todo.id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [{ handlerId }, drop] = useDrop<
    Todo,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'TODO',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item: Todo, monitor) {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      swapTodos(index, item.index)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })

  const handleOnClickDelete = useCallback(() => {
    removeTodo(todo)
  }, [todo, removeTodo])

  drag(drop(ref))

  const opacity = useMemo(() => (isDragging ? 0 : 1), [isDragging])

  return (
    <li
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className='flex text-slate-700 justify-between items-center'
    >
      <MdDragIndicator
        size={18}
        fill='#e5d4ed'
        className='mr-1 cursor-pointer'
      />

      <input
        onChange={() => toglgeDone(todo)}
        defaultChecked={todo.done}
        type='checkbox'
        name={`todo-${todo.id}`}
        id={todo.id}
      />

      <label
        htmlFor={todo.id}
        className={`flex-1 ml-2 cursor-pointer${
          todo.done ? ' line-through text-slate-500' : ''
        }`}
      >
        {todo.title}
      </label>

      <FaRegTrashAlt
        onClick={handleOnClickDelete}
        size={16}
        className={`cursor-pointer fill-slate-500`}
      />
    </li>
  )
}

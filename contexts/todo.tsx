import { Todo } from '@/components/todoList'
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import randomUUID from '../lib/randomUUID'

interface TodoContextData {
  todos: Todo[]
  loading: boolean
  addTodo(title: string): void
  removeTodo(todo: Todo): void
  toglgeDone(todo: Todo): void
  swapTodos(fromIndex: number, toIndex: number): void
}

const TodoContext = createContext({} as TodoContextData)

const TODO_KEY = '@todo/items'

interface TodoProviderProps {
  children: JSX.Element
}

const TodoProvider: FC<TodoProviderProps> = ({ children }) => {
  const sleep = useCallback(async (ms: number) => {
    return await new Promise(resolve => setTimeout(resolve, ms))
  }, [])

  const [loading, setloading] = useState(true)

  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    async function retrieveTodos() {
      const exists = localStorage.getItem(TODO_KEY)

      if (exists) {
        const retrieved = JSON.parse(exists)

        await sleep(1000)

        setTodos(retrieved as Todo[])
      }

      setloading(false)
    }

    retrieveTodos()
  }, [sleep])

  useEffect(() => {
    if (!todos.length) return
    localStorage.setItem(TODO_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback((title: string) => {
    setTodos(oldState => [
      ...oldState,
      {
        id: randomUUID(),
        title,
        index: oldState.length,
        done: false
      }
    ])
  }, [])

  const removeTodo = useCallback(
    (todo: Todo) => {
      if (todos.length === 1) localStorage.setItem(TODO_KEY, '[]')

      const newTodos = todos.filter(({ id }) => id !== todo.id)

      setTodos(newTodos)
    },
    [todos]
  )

  const swapTodos = useCallback((fromIndex: number, toIndex: number) => {
    setTodos(oldState => {
      const _old = [...oldState]
      _old[fromIndex] = _old.splice(toIndex, 1, _old[fromIndex])[0]
      return _old
    })
  }, [])

  const toglgeDone = useCallback(
    (todo: Todo) => {
      const index = todos.findIndex(({ id }) => id === todo.id)

      console.log('index:', index)

      if (index >= 0) {
        setTodos(oldState => {
          const _oldState = [...oldState]
          const _todo = { ..._oldState[index] }

          _todo.done = !_todo.done

          _oldState[index] = _todo

          return _oldState
        })
      }
    },
    [todos]
  )

  const value: TodoContextData = {
    todos,
    addTodo,
    removeTodo,
    loading,
    toglgeDone,
    swapTodos
  }

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}

function useTodos() {
  const todosContext = useContext(TodoContext)

  if (!todosContext) {
    throw new Error('useTodos function cannot be use out of a TodoProvider')
  }

  return todosContext
}

export { TodoProvider, useTodos }

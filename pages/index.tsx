import TodoList from '@/components/todoList'
import { useTodos } from '@/contexts/todo'
import Head from 'next/head'
import { FormEvent } from 'react'
import { FaPlus } from 'react-icons/fa'

export default function Home() {
  const { addTodo, loading } = useTodos()
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (loading) return

    const input = e.currentTarget[0]

    if (input instanceof HTMLInputElement) {
      addTodo(input.value)

      input.value = ''
    }
  }

  return (
    <>
      <Head>
        <title>Todo list | Next.js</title>
        <meta name='description' content='A project to learn Next.js' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <header>
        <h1
          className={`text-[#e5d4ed] text-center text-4xl sm:text-5xl font-bold select-none my-5`}
        >
          To Do list
        </h1>
      </header>

      <section className='px-2 sm:px-0'>
        <form onSubmit={handleSubmit}>
          <div className={`bg-white rounded flex px-4`}>
            <label className='sr-only' htmlFor=''>
              Type a todo item
            </label>

            <input
              type='text'
              placeholder='New To Do'
              className={`text-slate-500 bg-transparent outline-none py-2 w-0 flex-1${
                loading ? ' placeholder:text-transparent' : ''
              }`}
            />

            <button className='text-slate-500' type='submit'>
              <FaPlus size={12} />
            </button>
          </div>
        </form>

        <TodoList />
      </section>
    </>
  )
}

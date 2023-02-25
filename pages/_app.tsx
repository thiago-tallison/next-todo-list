import { TodoProvider } from '@/contexts/todo'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Poppins } from 'next/font/google'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TodoProvider>
      <DndProvider backend={HTML5Backend}>
        <main className={`${poppins.className} max-w-lg mx-auto`}>
          <Component {...pageProps} />
        </main>
      </DndProvider>
    </TodoProvider>
  )
}

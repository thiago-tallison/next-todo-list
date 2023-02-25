export default function TodoListSkeleton() {
  return (
    <ul className='mt-10 bg-white shadow-lg rounded-lg p-4 space-y-2'>
      <li className='bg-slate-400 rounded animate-pulse w-full h-6'></li>
      <li className='bg-slate-400 rounded animate-pulse w-full h-6'></li>
      <li className='bg-slate-400 rounded animate-pulse w-full h-6'></li>
    </ul>
  )
}

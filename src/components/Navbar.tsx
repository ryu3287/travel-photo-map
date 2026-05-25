'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="h-14 bg-white border-b border-stone-200 flex items-center px-6 gap-6">
      <Link href="/" className="flex items-center gap-2 font-bold text-stone-800 text-sm">
        <span className="text-xl">🗺️</span>
        旅行記録マップ
      </Link>
      <div className="flex items-center gap-1 ml-4">
        <Link
          href="/"
          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
            pathname === '/'
              ? 'bg-stone-100 text-stone-800 font-medium'
              : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
          }`}
        >
          地図
        </Link>
        <Link
          href="/upload"
          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
            pathname === '/upload'
              ? 'bg-stone-100 text-stone-800 font-medium'
              : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
          }`}
        >
          アップロード
        </Link>
      </div>
      <div className="ml-auto">
        <Link
          href="/upload"
          className="px-4 py-1.5 bg-sky-500 text-white text-sm rounded-lg hover:bg-sky-600 transition-colors font-medium"
        >
          + 写真を追加
        </Link>
      </div>
    </nav>
  )
}

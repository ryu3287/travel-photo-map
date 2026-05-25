import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: '旅行記録マップ',
  description: '写真のEXIFデータから旅の記録を地図に可視化するアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}

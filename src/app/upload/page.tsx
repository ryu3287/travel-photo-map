'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface UploadItem {
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'done' | 'error'
  tags?: string[]
}

export default function UploadPage() {
  const [items, setItems] = useState<UploadItem[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const addFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith('image/'))
    const newItems: UploadItem[] = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
    }))
    setItems((prev) => [...prev, ...newItems])
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      addFiles(Array.from(e.dataTransfer.files))
    },
    [addFiles]
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files))
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadAll = async () => {
    setUploading(true)

    for (let i = 0; i < items.length; i++) {
      if (items[i].status !== 'pending') continue

      setItems((prev) =>
        prev.map((item, idx) =>
          idx === i ? { ...item, status: 'uploading' } : item
        )
      )

      try {
        // ブラウザ側はファイルを送るだけ。EXIF解析・タグ付け・DB保存はすべてサーバーで実行。
        const formData = new FormData()
        formData.append('file', items[i].file)

        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()

        if (data.success) {
          setItems((prev) =>
            prev.map((item, idx) =>
              idx === i ? { ...item, status: 'done', tags: data.photo.tags } : item
            )
          )
        } else {
          throw new Error(data.error)
        }
      } catch {
        setItems((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: 'error' } : item
          )
        )
      }
    }
    setUploading(false)
  }

  const allDone = items.length > 0 && items.every((i) => i.status === 'done')
  const pendingCount = items.filter((i) => i.status === 'pending').length

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-800 mb-1">写真をアップロード</h1>
        <p className="text-stone-500 text-sm">
          写真を選ぶだけ。EXIF解析・AI タグ付け・地図保存はすべてサーバーが行います。
        </p>
      </div>

      {/* ドロップゾーン */}
      <div
        className={`drop-zone rounded-xl p-10 text-center cursor-pointer mb-6 transition-all ${
          isDragOver ? 'drag-over' : 'bg-white'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-4xl mb-3">📸</div>
        <p className="text-stone-600 font-medium">写真をドラッグ&ドロップ</p>
        <p className="text-stone-400 text-sm mt-1">または クリックして選択</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* プレビューグリッド */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {items.map((item, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden bg-stone-100 aspect-square">
              <Image
                src={item.preview}
                alt={item.file.name}
                fill
                className="object-cover"
              />
              {item.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-xs">サーバーで処理中...</div>
                </div>
              )}
              {item.status === 'done' && (
                <div className="absolute inset-0 bg-green-500/20 flex items-start justify-end p-1">
                  <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">✓</span>
                </div>
              )}
              {item.status === 'error' && (
                <div className="absolute inset-0 bg-red-500/20 flex items-start justify-end p-1">
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">✗</span>
                </div>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/40 flex flex-wrap gap-1">
                  {item.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-white text-xs bg-black/30 rounded px-1">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {item.status === 'pending' && (
                <button
                  onClick={(e) => { e.stopPropagation(); removeItem(i) }}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-black/70"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* アクションボタン */}
      {items.length > 0 && (
        <div className="flex gap-3 justify-end">
          {allDone ? (
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-colors"
            >
              地図で見る →
            </button>
          ) : (
            <>
              <button
                onClick={() => setItems([])}
                className="px-4 py-2 text-stone-500 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                disabled={uploading}
              >
                クリア
              </button>
              <button
                onClick={uploadAll}
                disabled={uploading || pendingCount === 0}
                className="px-6 py-2 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? 'サーバーで処理中...' : `${pendingCount}枚をアップロード`}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

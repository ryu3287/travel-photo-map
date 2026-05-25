'use client'

import Image from 'next/image'
import { Photo } from '@/types'

interface PhotoSidebarProps {
  photos: Photo[]
  selectedPhoto: Photo | null
  onSelectPhoto: (photo: Photo) => void
  loading: boolean
}

export default function PhotoSidebar({
  photos,
  selectedPhoto,
  onSelectPhoto,
  loading,
}: PhotoSidebarProps) {
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-stone-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="p-6 text-center text-stone-400">
        <div className="text-3xl mb-2">📷</div>
        <p className="text-sm">写真がありません</p>
        <p className="text-xs mt-1">アップロードページから写真を追加してください</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-stone-100">
      {photos.map((photo, index) => {
        const isSelected = selectedPhoto?.id === photo.id
        const date = photo.taken_at
          ? new Date(photo.taken_at).toLocaleDateString('ja-JP', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : null

        return (
          <div
            key={photo.id}
            onClick={() => onSelectPhoto(photo)}
            className={`flex gap-3 p-3 cursor-pointer transition-colors ${
              isSelected ? 'bg-sky-50' : 'hover:bg-stone-50'
            }`}
          >
            {/* 番号バッジ */}
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                isSelected ? 'bg-orange-400' : 'bg-sky-400'
              }`}
            >
              {index + 1}
            </div>

            {/* サムネイル */}
            <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 bg-stone-100">
              <Image
                src={photo.storage_url}
                alt={photo.file_name}
                width={56}
                height={56}
                className="object-cover w-full h-full"
              />
            </div>

            {/* テキスト情報 */}
            <div className="flex-1 min-w-0">
              {date && (
                <p className="text-xs text-stone-400 mb-1">{date}</p>
              )}
              {photo.location_name && (
                <p className="text-xs text-stone-600 font-medium truncate mb-1">
                  📍 {photo.location_name}
                </p>
              )}
              {photo.latitude === null && (
                <p className="text-xs text-amber-500">GPS情報なし</p>
              )}
              {/* タグ */}
              <div className="flex flex-wrap gap-1 mt-1">
                {(photo.tags || []).slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-sky-50 text-sky-600 rounded px-1.5 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

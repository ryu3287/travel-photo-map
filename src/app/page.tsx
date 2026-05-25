'use client'

import { useEffect, useState, useCallback } from 'react'
import { Photo } from '@/types'
import MapView from '@/components/MapView'
import PhotoSidebar from '@/components/PhotoSidebar'
import TagFilter from '@/components/TagFilter'

export default function HomePage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPhotos = useCallback(async () => {
    setLoading(true)
    try {
      const params = selectedTag ? `?tag=${encodeURIComponent(selectedTag)}` : ''
      const res = await fetch(`/api/photos${params}`)
      const data = await res.json()
      setPhotos(data.photos || [])
    } catch (err) {
      console.error('Failed to fetch photos:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedTag])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  const photosWithLocation = photos.filter(
    (p) => p.latitude !== null && p.longitude !== null
  )

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* サイドバー */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-stone-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-stone-100">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">
            タグフィルター
          </h2>
          <TagFilter
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <PhotoSidebar
            photos={photos}
            selectedPhoto={selectedPhoto}
            onSelectPhoto={setSelectedPhoto}
            loading={loading}
          />
        </div>
        <div className="p-3 border-t border-stone-100 text-xs text-stone-400 text-center">
          {photosWithLocation.length} 枚の写真が地図上に表示
        </div>
      </div>

      {/* マップ */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 bg-stone-50/80 flex items-center justify-center z-10">
            <div className="text-stone-400 text-sm">読み込み中...</div>
          </div>
        )}
        <MapView
          photos={photosWithLocation}
          selectedPhoto={selectedPhoto}
          onSelectPhoto={setSelectedPhoto}
        />
      </div>
    </div>
  )
}

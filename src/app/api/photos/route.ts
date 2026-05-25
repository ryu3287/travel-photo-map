import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Photos API called')
    console.log('Environment check:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '***' : 'MISSING',
    })

    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag')

    let query = supabaseAdmin
      .from('photos')
      .select('*')
      .order('taken_at', { ascending: true, nullsFirst: false })

    // タグフィルター
    if (tag) {
      query = query.contains('tags', [tag])
    }

    const { data: photos, error } = await query

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    console.log(`✅ Found ${photos?.length || 0} photos`)
    return NextResponse.json({ photos: photos || [] })
  } catch (error) {
    console.error('❌ Photos API error:', error)
    return NextResponse.json({ error: `Internal server error: ${String(error)}` }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    // ストレージからも削除
    const { data: photo } = await supabaseAdmin
      .from('photos')
      .select('file_name')
      .eq('id', id)
      .single()

    if (photo) {
      const fileName = photo.file_name
      await supabaseAdmin.storage.from('travel-photos').remove([fileName])
    }

    const { error } = await supabaseAdmin
      .from('photos')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

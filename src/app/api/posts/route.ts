import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/database'

export async function GET() {
  try {
    const posts = await getAllPosts()
    
    return NextResponse.json({
      success: true,
      data: posts
    })
  } catch (error) {
    console.error('获取帖子失败:', error)
    return NextResponse.json(
      { success: false, message: '获取帖子失败' },
      { status: 500 }
    )
  }
}

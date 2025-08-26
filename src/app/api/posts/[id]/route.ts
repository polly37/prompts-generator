import { NextRequest, NextResponse } from 'next/server'
import { deletePost } from '@/lib/database'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ success: false, message: '缺少帖子ID' }, { status: 400 })
    }

    // 从数据库删除
    await deletePost(id)

    // 可选：删除对应的图片文件
    // 注意：在生产环境中你可能想保留图片文件或使用更复杂的清理策略

    return NextResponse.json({
      success: true,
      message: '删除成功'
    })
  } catch (error) {
    console.error('删除帖子失败:', error)
    return NextResponse.json(
      { success: false, message: '删除失败' },
      { status: 500 }
    )
  }
}

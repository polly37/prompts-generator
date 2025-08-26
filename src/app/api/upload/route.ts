import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { savePost } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('image') as unknown as File
    const prompt = data.get('prompt') as string
    const userName = data.get('userName') as string

    if (!file) {
      return NextResponse.json({ success: false, message: '没有上传文件' }, { status: 400 })
    }

    if (!prompt || !userName) {
      return NextResponse.json({ success: false, message: '缺少必要信息' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 生成唯一的文件名
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 9)
    const fileExtension = path.extname(file.name)
    const fileName = `${timestamp}_${randomString}${fileExtension}`

    // 确保uploads目录存在
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // 保存文件
    const filePath = path.join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    // 生成访问URL
    const imageUrl = `/uploads/${fileName}`
    const imagePath = filePath

    // 保存到数据库
    const postId = `${timestamp}_${randomString}`
    const uploadTime = new Date().toLocaleString('zh-CN')

    await savePost({
      id: postId,
      imageUrl,
      imagePath,
      prompt,
      userName,
      uploadTime
    })

    return NextResponse.json({
      success: true,
      message: '上传成功',
      data: {
        id: postId,
        imageUrl,
        prompt,
        userName,
        uploadTime
      }
    })

  } catch (error) {
    console.error('上传出错:', error)
    return NextResponse.json(
      { success: false, message: '上传失败' },
      { status: 500 }
    )
  }
}

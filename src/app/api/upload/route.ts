import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { savePost } from '@/lib/database'

export async function POST(request: NextRequest) {
  console.log('开始处理上传请求...')
  
  try {
    const data = await request.formData()
    console.log('formData 解析成功')
    
    const file: File | null = data.get('image') as unknown as File
    const prompt = data.get('prompt') as string
    const userName = data.get('userName') as string

    console.log('接收到的数据:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      promptLength: prompt?.length,
      userName: userName
    })

    if (!file) {
      console.log('错误: 没有上传文件')
      return NextResponse.json({ success: false, message: '没有上传文件' }, { status: 400 })
    }

    if (!prompt || !userName) {
      console.log('错误: 缺少必要信息', { prompt: !!prompt, userName: !!userName })
      return NextResponse.json({ success: false, message: '缺少必要信息' }, { status: 400 })
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      console.log('错误: 不支持的文件类型', file.type)
      return NextResponse.json({ success: false, message: '只支持图片格式 (JPEG, PNG, GIF, WebP)' }, { status: 400 })
    }

    // 检查文件大小 (限制为 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.log('错误: 文件过大', file.size)
      return NextResponse.json({ success: false, message: '文件大小不能超过 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('文件读取成功，大小:', buffer.length)

    // 生成唯一的文件名
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 9)
    const fileExtension = path.extname(file.name)
    const fileName = `${timestamp}_${randomString}${fileExtension}`

    // 确保uploads目录存在
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    console.log('uploads目录路径:', uploadsDir)
    
    if (!existsSync(uploadsDir)) {
      console.log('创建uploads目录')
      await mkdir(uploadsDir, { recursive: true })
    }

    // 保存文件
    const filePath = path.join(uploadsDir, fileName)
    console.log('准备保存文件到:', filePath)
    
    await writeFile(filePath, buffer)
    console.log('文件保存成功')

    // 生成访问URL
    const imageUrl = `/uploads/${fileName}`
    const imagePath = filePath

    // 保存到数据库
    const postId = `${timestamp}_${randomString}`
    const uploadTime = new Date().toLocaleString('zh-CN')
    
    console.log('准备保存到数据库:', {
      id: postId,
      imageUrl,
      prompt: prompt.substring(0, 50) + '...',
      userName,
      uploadTime
    })

    await savePost({
      id: postId,
      imageUrl,
      imagePath,
      prompt,
      userName,
      uploadTime
    })
    
    console.log('数据库保存成功')

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
    console.error('上传出错详细信息:', error)
    return NextResponse.json(
      { success: false, message: `上传失败: ${error instanceof Error ? error.message : '未知错误'}` },
      { status: 500 }
    )
  }
}

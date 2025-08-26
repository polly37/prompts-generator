// 测试上传功能的脚本
const fs = require('fs')
const path = require('path')

async function testUpload() {
  console.log('开始测试上传功能...')
  
  try {
    // 创建一个小的测试图片文件 (base64编码的1x1像素PNG)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
    const testImageBuffer = Buffer.from(testImageBase64, 'base64')
    
    // 模拟文件对象
    const FormData = require('form-data')
    const form = new FormData()
    
    form.append('image', testImageBuffer, {
      filename: 'test.png',
      contentType: 'image/png'
    })
    form.append('prompt', '测试提示词')
    form.append('userName', '测试用户')
    
    console.log('准备发送请求到服务器...')
    
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    })
    
    console.log('响应状态:', response.status)
    console.log('响应头:', response.headers)
    
    const result = await response.text()
    console.log('响应内容:', result)
    
    if (response.ok) {
      console.log('✅ 上传测试成功!')
      const data = JSON.parse(result)
      console.log('返回数据:', data)
    } else {
      console.log('❌ 上传测试失败!')
    }
    
  } catch (error) {
    console.error('测试过程中出错:', error)
  }
}

testUpload()

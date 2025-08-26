import sqlite3 from 'sqlite3'
import path from 'path'

// 数据库文件路径
const dbPath = path.join(process.cwd(), 'data', 'posts.db')

// 确保数据目录存在
import fs from 'fs'
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// 创建数据库连接
const db = new sqlite3.Database(dbPath)

// 初始化数据库表
export const initDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        imageUrl TEXT NOT NULL,
        imagePath TEXT NOT NULL,
        prompt TEXT NOT NULL,
        userName TEXT NOT NULL,
        uploadTime TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

// 保存帖子到数据库
export const savePost = (post: {
  id: string
  imageUrl: string
  imagePath: string
  prompt: string
  userName: string
  uploadTime: string
}) => {
  return new Promise<void>((resolve, reject) => {
    const { id, imageUrl, imagePath, prompt, userName, uploadTime } = post
    db.run(
      `INSERT INTO posts (id, imageUrl, imagePath, prompt, userName, uploadTime) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, imageUrl, imagePath, prompt, userName, uploadTime],
      (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })
}

// 获取所有帖子
export const getAllPosts = () => {
  return new Promise<Array<{
    id: string
    imageUrl: string
    imagePath: string
    prompt: string
    userName: string
    uploadTime: string
  }>>((resolve, reject) => {
    db.all(
      `SELECT id, imageUrl, imagePath, prompt, userName, uploadTime 
       FROM posts ORDER BY createdAt DESC`,
      [],
      (err, rows: Array<{
        id: string
        imageUrl: string
        imagePath: string
        prompt: string
        userName: string
        uploadTime: string
      }>) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      }
    )
  })
}

// 删除帖子
export const deletePost = (id: string) => {
  return new Promise<void>((resolve, reject) => {
    db.run('DELETE FROM posts WHERE id = ?', [id], (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

// 初始化数据库
initDatabase().catch(console.error)

export default db

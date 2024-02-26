const { readdir, stat, unlink } = require('fs')
const { extname, join } = require('path')

// 删除指定目录下的所有 HTML 文件的函数
function deleteHtmlFiles(directoryPath) {
  // 读取目录
  readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err)
      return
    }

    files.forEach((file) => {
      const filePath = join(directoryPath, file)
      // 使用 stat 获取信息
      stat(filePath, (innerErr, { isFile } = {}) => {
        if (innerErr) {
          console.error('Error getting file stats:', innerErr)
          return
        }

        if (isFile() && extname(file) === '.html') {
          // 删除文件
          unlink(filePath, (thirdErr) => {
            if (thirdErr) {
              console.error('Error deleting file:', thirdErr)
            } else {
              console.log(`Deleted HTML file: ${filePath}`)
            }
          })
        }
      })
    })
  })
}

deleteHtmlFiles(process.cwd())

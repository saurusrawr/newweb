const fs = require("fs");
const path = require("path");

export default function handler(req, res) {
  const { id } = req.query; // Ambil ID dari URL
  
  if (!id) {
    return res.status(400).send("Missing file ID");
  }

  const filesDir = path.join(process.cwd(), "files");
  
  // Cari file yang cocok dengan ID
  const files = fs.readdirSync(filesDir);
  const fileInfo = files.find(f => f.startsWith(id + "."));
  
  if (!fileInfo) {
    return res.status(404).send("File not found");
  }

  const filePath = path.join(filesDir, fileInfo);
  const ext = path.extname(fileInfo).slice(1).toLowerCase();
  
  // Tentukan Content-Type
  const mimeTypes = {
    'html': 'text/html',
    'js': 'application/javascript',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'ico': 'image/x-icon',
    'mp4': 'video/mp4',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    'webm': 'video/webm',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    'pdf': 'application/pdf',
    'txt': 'text/plain',
    'json': 'application/json',
    'css': 'text/css'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';

  // Untuk zip/pdf langsung download, Others langsung tampil
  const contentDisposition = ['zip', 'rar', '7z', 'pdf'].includes(ext)
    ? `attachment; filename="${fileInfo}"`
    : `inline; filename="${fileInfo}"`;

  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", contentDisposition);
  
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}

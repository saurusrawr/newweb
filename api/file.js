const fs = require("fs");
const path = require("path");

export default function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send("Missing file ID");
  }

  const filesDir = path.join(process.cwd(), "files");

  // Cari file yang cocok
  let filename = null;
  let ext = null;

  try {
    const files = fs.readdirSync(filesDir);
    for (const f of files) {
      if (f.startsWith(id + ".")) {
        filename = f;
        ext = path.extname(f).slice(1).toLowerCase();
        break;
      }
    }
  } catch (err) {
    console.error("Read dir error:", err);
    return res.status(500).send("File not found");
  }

  if (!filename) {
    return res.status(404).send("File not found");
  }

  const filePath = path.join(filesDir, filename);

  // MIME Types
  const mimeTypes = {
    'js': 'application/javascript',
    'ts': 'application/typescript',
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
    'gz': 'application/gzip',
    'pdf': 'application/pdf',
    'txt': 'text/plain',
    'json': 'application/json',
    'xml': 'application/xml',
    'html': 'text/html',
    'css': 'text/css',
    'scss': 'text/x-scss'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  // Auto-download untuk file archive
  const forceDownload = ['zip', 'rar', '7z', 'gz', 'pdf'].includes(ext);
  const disposition = forceDownload 
    ? `attachment; filename="${filename}"` 
    : `inline; filename="${filename}"`;

  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", disposition);

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}

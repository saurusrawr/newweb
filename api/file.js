const fs = require("fs");
const path = require("path");

export default function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send("Missing ID");

  const filesDir = path.join(process.cwd(), "files");
  const files = fs.readdirSync(filesDir);
  const file = files.find(f => f.startsWith(id + "."));

  if (!file) return res.status(404).send("Not found");

  const ext = path.extname(file).slice(1).toLowerCase();
  const mimeTypes = {
    'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg',
    'gif': 'image/gif', 'svg': 'image/svg+xml', 'webp': 'image/webp',
    'mp4': 'video/mp4', 'webm': 'video/webm',
    'mp3': 'audio/mpeg', 'wav': 'audio/wav', 'ogg': 'audio/ogg',
    'zip': 'application/zip', 'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed', 'pdf': 'application/pdf',
    'txt': 'text/plain', 'json': 'application/json',
    'js': 'application/javascript'
  };

  const isDownload = ['zip', 'rar', '7z', 'pdf'].includes(ext);
  res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
  res.setHeader("Content-Disposition", `${isDownload ? "attachment" : "inline"}; filename="${file}"`);

  fs.createReadStream(path.join(filesDir, file)).pipe(res);
}

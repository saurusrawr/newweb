const fs = require("fs");
const path = require("path");
const { IncomingForm } = require("formidable");
const crypto = require("crypto");

const generateId = () => crypto.randomBytes(4).toString("hex");

const ALLOWED_EXTENSIONS = [
  'js', 'ts', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico',
  'mp4', 'mp3', 'wav', 'ogg', 'flac', 'webm',
  'zip', 'rar', '7z', 'tar', 'gz',
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'txt', 'json', 'xml', 'html', 'css', 'scss'
];

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Method not allowed" });
  }

  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), "files"),
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Parse error:", err);
      return res.status(500).json({ status: false, message: "Error parsing form" });
    }

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ status: false, message: "No file uploaded" });
    }

    const ext = path.extname(file.originalFilename || "").slice(1).toLowerCase();
    
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      fs.unlink(file.filepath, () => {});
      return res.status(400).json({ status: false, message: `Extension .${ext} not allowed` });
    }

    let id = generateId();
    const filesDir = path.join(process.cwd(), "files");
    
    // Pastikan ID unik
    while (fs.existsSync(path.join(filesDir, `${id}.${ext}`))) {
      id = generateId();
    }

    const newFilename = `${id}.${ext}`;
    const newPath = path.join(filesDir, newFilename);

    fs.rename(file.filepath, newPath, (err) => {
      if (err) {
        console.error("Rename error:", err);
        return res.status(500).json({ status: false, message: "Error saving file" });
      }

      const baseUrl = req.headers.host || "yourdomain.com";
      const protocol = req.headers["x-forwarded-proto"] || "https";
      const fileUrl = `${protocol}://${baseUrl}/files/${id}.${ext}`;

      return res.status(200).json({
        status: true,
        result: {
          id: id,
          name: newFilename,
          link: fileUrl,
          url: fileUrl,
          size: fs.statSync(newPath).size,
          ext: ext
        }
      });
    });
  });
}

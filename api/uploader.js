const fs = require("fs");
const path = require("path");
const { IncomingForm } = require("formidable");
const crypto = require("crypto");

const generateId = () => crypto.randomBytes(4).toString("hex");

const ALLOWED_EXTENSIONS = [
  'js', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg',
  'mp4', 'mp3', 'wav', 'ogg', 'webm',
  'zip', 'rar', '7z', 'pdf', 'txt', 'json'
];

export const config = { api: { bodyParser: false } };

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Method not allowed" });
  }

  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), "files"),
    keepExtensions: true
  });

  form.parse(req, (err, fields, files) => {
    if (err || !files.file) {
      return res.status(400).json({ status: false, message: "Upload failed" });
    }

    const file = files.file[0];
    const ext = path.extname(file.originalFilename).slice(1).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      fs.unlink(file.filepath, () => {});
      return res.status(400).json({ status: false, message: "Extension not allowed" });
    }

    let id = generateId();
    const filesDir = path.join(process.cwd(), "files");
    while (fs.existsSync(path.join(filesDir, `${id}.${ext}`))) {
      id = generateId();
    }

    const newPath = path.join(filesDir, `${id}.${ext}`);
    fs.rename(file.filepath, newPath, () => {});

    const host = req.headers.host || "yourdomain.com";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const link = `${protocol}://${host}/files/${id}.${ext}`;

    res.status(200).json({
      status: true,
      result: { link, id, name: `${id}.${ext}` }
    });
  });
}

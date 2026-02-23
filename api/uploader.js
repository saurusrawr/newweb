const fs = require("fs");
const path = require("path");
const { IncomingForm } = require("formidable");
const crypto = require("crypto");

// Generate ID acak unik (8 karakter hex)
const generateId = () => {
  return crypto.randomBytes(4).toString("hex");
};

// Ekstensi yang diizinkan
const ALLOWED_EXTENSIONS = [
  'js', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico',
  'mp4', 'mp3', 'wav', 'ogg', 'flac', 'webm',
  'zip', 'rar', '7z', 'tar', 'gz',
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'txt', 'json', 'xml', 'html', 'css'
];

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Method not allowed" });
  }

  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), "files"),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ status: false, message: "Error parsing form" });
    }

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ status: false, message: "No file uploaded" });
    }

    // Validasi ekstensi
    const ext = path.extname(file.originalFilename || file.newFilename).slice(1).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      fs.unlinkSync(file.filepath); // Hapus file jika tidak diizinkan
      return res.status(400).json({ status: false, message: `Extension .${ext} not allowed` });
    }

    // Generate ID unik
    let id = generateId();
    const filesDir = path.join(process.cwd(), "files");
    
    // Cek agar ID tidak sama dengan file yang sudah ada
    while (fs.existsSync(path.join(filesDir, `${id}.${ext}`))) {
      id = generateId();
    }

    // Rename file dengan ID baru
    const newFilename = `${id}.${ext}`;
    const newPath = path.join(filesDir, newFilename);
    
    fs.renameSync(file.filepath, newPath);

    // URL file (ganti dengan domain kamu)
    const baseUrl = req.headers.host || "yourdomain.com";
    const protocol = req.headers["x-forwarded-proto"] || "http";
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
}

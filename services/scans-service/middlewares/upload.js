const multer = require('multer');
const path = require('path');
const fs = require('fs');

const baseDir = path.resolve(process.env.FILE_UPLOAD_DIR || './uploads/scans');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Optional: store in patient-specific folder
    const patientId = req.body.patientId;
    let dest = baseDir;

    if (patientId) {
      dest = path.join(baseDir, String(patientId));
    }

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    const storedName = `${base}_${timestamp}${ext}`;
    cb(null, storedName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB
  }
});

module.exports = {
  upload
};

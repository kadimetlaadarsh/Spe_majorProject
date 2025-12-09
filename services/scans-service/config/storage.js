const fs = require('fs');
const path = require('path');

function initStorage() {
  const baseDir = process.env.FILE_UPLOAD_DIR || './uploads/scans';
  const resolved = path.resolve(baseDir);

  if (!fs.existsSync(resolved)) {
    fs.mkdirSync(resolved, { recursive: true });
    console.log('Created upload directory:', resolved);
  } else {
    console.log('Using upload directory:', resolved);
  }

  return resolved;
}

module.exports = initStorage;

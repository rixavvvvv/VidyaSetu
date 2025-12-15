const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'video') {
      uploadPath += 'videos/';
    } else if (file.fieldname === 'audio') {
      uploadPath += 'audio/';
    } else if (file.fieldname === 'pdf') {
      uploadPath += 'documents/';
    } else if (file.fieldname === 'image' || file.fieldname === 'thumbnail') {
      uploadPath += 'images/';
    } else {
      uploadPath += 'misc/';
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    video: ['.mp4', '.avi', '.mov', '.wmv', '.webm'],
    audio: ['.mp3', '.wav', '.ogg', '.m4a'],
    pdf: ['.pdf'],
    image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    thumbnail: ['.jpg', '.jpeg', '.png', '.webp']
  };

  const ext = path.extname(file.originalname).toLowerCase();
  const fieldType = file.fieldname;

  if (allowedTypes[fieldType] && allowedTypes[fieldType].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${fieldType}. Allowed: ${allowedTypes[fieldType]?.join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024 // 50MB default
  }
});

module.exports = upload;

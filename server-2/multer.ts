import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, './public/uploads/profiles'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = req.user.id + '-' + Date.now() + ext;
    cb(null, filename);
  }
});

export const upload = multer({ storage });

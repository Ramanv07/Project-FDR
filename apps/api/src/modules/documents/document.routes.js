import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

router.post('/upload', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Simulated OCR processing pipeline
  return res.json({
    filename: req.file.originalname,
    size: req.file.size,
    ocr: {
      confidence: 0.98,
      detectedLien: 'Member Secretary, AICTE New Delhi',
    },
  });
});

export default router;

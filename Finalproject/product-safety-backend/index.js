const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { extractTextFromS3Image } = require('./rekognitionUtil');
const { ImageModel } = require('./db');
const { gradeIngredients } = require('./gradeutil');
require('dotenv').config();

console.log('🛠️ Booting server...');

console.log('✅ ENV Loaded:', {
  MONGO_URI: process.env.MONGO_URI ? '✅' : '❌',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? '✅' : '❌',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? '✅' : '❌',
});

const app = express();

// ✅ Enable parsing JSON body in requests
app.use(express.json());

// ✅ Proper CORS config — Vercel frontend is explicitly allowed
const corsOptions = {
  origin: 'https://product-safety-analyser.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Pre-flight handling — recommended in CORS docs
app.options('*', cors(corsOptions));

// ✅ Multer: file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ AWS S3 setup
const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

// ✅ Test endpoint for CORS
app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

// ✅ Upload + OCR + Grading
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imageKey = 'uploads/' + req.file.originalname;

    const s3Upload = new Upload({
      client: s3Client,
      params: {
        Bucket: 'productimages2025',
        Key: imageKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      },
    });

    const result = await s3Upload.done();
    console.log('✅ Uploaded to S3 at:', result.Location);

    // ✅ OCR
    const detectedText = await extractTextFromS3Image('productimages2025', imageKey);
    console.log('🧠 OCR Text:', detectedText);

    // ✅ Grading
    const gradedIngredients = gradeIngredients(detectedText);
    console.log('🥇 Graded Ingredients:', gradedIngredients);

    // ✅ Save to MongoDB
    const imageData = new ImageModel({
      originalFilename: req.file.originalname,
      imageKey,
      s3Url: result.Location,
      text: detectedText,
      extractedText: detectedText,
      gradedIngredients,
    });

    await imageData.save();
    console.log('📦 Saved to MongoDB');

    res.json({
      message: 'Upload + OCR + Grading successful',
      filename: imageKey,
      url: result.Location,
      text: detectedText,
      gradedIngredients,
    });

  } catch (err) {
    console.error('🔥 Upload/OCR Error:', err);
    res.status(500).json({ error: 'Upload or OCR failed', details: err.message });
  }
});

// ✅ MongoDB connect and start server
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });

/*
  🔄 Optional: Keep-alive ping to prevent Railway shutdown (every 5 minutes)
  Uncomment if you want to test this
*/
// setInterval(() => {
//   fetch('https://product-safety-analyser-production.up.railway.app/test-cors')
//     .then(res => res.json())
//     .then(data => console.log('🔁 Keep-alive ping OK:', data))
//     .catch(err => console.error('❌ Keep-alive ping failed:', err));
// }, 5 * 60 * 1000);

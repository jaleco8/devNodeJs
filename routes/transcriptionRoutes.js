const express = require('express');
const router = express.Router();

// Transcription Controller
const transcriptionController = require('../controllers/transcriptionController');

// Routes

router.post("/read", transcriptionController.read);


module.exports = router;
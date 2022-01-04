const express = require('express');
const router = express.Router();

const {upload} = require('../../middlewares/multerUpload')
const convertController = require('./convert.controller');

router.post('/convert', upload.single("file"), convertController.convert);

module.exports = router;

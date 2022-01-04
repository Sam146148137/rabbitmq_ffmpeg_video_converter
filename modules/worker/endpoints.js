const express = require('express');
const router = express.Router();

const workerController = require('./worker.controller');

router.post('/connect', workerController.connect);

module.exports = router;

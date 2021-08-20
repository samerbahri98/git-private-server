const express = require("express");
const router = express.Router();

router.use('/github',require('./github.js'))

module.exports = router;
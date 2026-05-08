const express = require('express');
const router = express.Router();

router.use('/logs', require('./logs'));
router.use('/categories', require('./categories'));
router.use('/stats', require('./stats'));
router.use('/reports', require('./reports'));

module.exports = router;

const express = require('express');
const router = express.Router();
const { validate, logSchema } = require('../middleware/validate');
const logController = require('../controllers/logController');

router.get('/', logController.getLogs);
router.post('/', validate(logSchema), logController.createLog);
router.post('/export', logController.exportLogs);
router.get('/:id', logController.getLogById);
router.put('/:id', validate(logSchema), logController.updateLog);
router.delete('/:id', logController.deleteLog);

module.exports = router;

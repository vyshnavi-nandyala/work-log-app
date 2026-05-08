const express = require('express');
const router = express.Router();
const { validate, categorySchema } = require('../middleware/validate');
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getCategories);
router.post('/', validate(categorySchema), categoryController.createCategory);
router.put('/:id', validate(categorySchema), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;

const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { body, validationResult } = require('express-validator');
const { addUserData } = require('../middleware/permissionMiddleware');
router.use(addUserData);
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
const updateValidationChain = [
    body('checkIn').optional().isISO8601().withMessage('Format checkIn harus berupa tanggal yang valid'),
    body('checkOut').optional().isISO8601().withMessage('Format checkOut harus berupa tanggal yang valid'),
]
router.put("/:id", updateValidationChain, presensiController.updatePresensi);
router.delete("/:id", presensiController.deletePresensi);
module.exports = router;
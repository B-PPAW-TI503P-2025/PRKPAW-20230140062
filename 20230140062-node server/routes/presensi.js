const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/permissionMiddleware');
router.use(authenticateToken);
router.post('/check-in', [authenticateToken, presensiController.upload.single('image')], presensiController.CheckIn);
router.post('/check-out', authenticateToken, presensiController.CheckOut);
const updateValidationChain = [
    body('checkIn').optional().isISO8601().withMessage('Format checkIn harus berupa tanggal yang valid'),
    body('checkOut').optional().isISO8601().withMessage('Format checkOut harus berupa tanggal yang valid'),
]
router.put("/:id", authenticateToken, updateValidationChain, presensiController.updatePresensi);
router.delete("/:id", authenticateToken, presensiController.deletePresensi);
module.exports = router;
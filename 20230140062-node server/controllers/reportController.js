const { Presensi } = require('../models');
const { Op, where } = require('sequelize');
const { format } = require('date-fns-tz');
const timeZone = "Asia/Jakarta";

exports.getDailyReport = async (req, res) => {
    try {
        const today = new Date();
        const { nama } = req.query;
        let options = { where: {} };

        if (nama) {
            options.where.nama = {
                [Op.like]: `%${nama}%`
            };
        }

        const records = await Presensi.findAll(options);

        res.json({
            reportDate: new Date().toLocaleString(), data: records,
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};
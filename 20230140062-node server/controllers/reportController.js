const { Presensi } = require('../models');
const { Op, where } = require('sequelize');
const { format } = require('date-fns-tz');
const timeZone = "Asia/Jakarta";

exports.getDailyReport = async (req, res) => {
    try {
        const { nama, tanggalMulai, tanggalSelesai } = req.query;
        let options = { where: {} };

        if (nama) {
            options.where.nama = {
                [Op.like]: `%${nama}%`
            };
        }

        if (tanggalMulai && tanggalSelesai) {
            const endDate = new Date(tanggalSelesai);
            endDate.setHours(endDate.getDate() + 1);

            options.where.checkIn = {
                [Op.between]: [
                    new Date(tanggalMulai),
                    endDate
                ]
            };
        }

        const records = await Presensi.findAll(options);

        const formattedRecords = records.map(record => ({
            userId: record.userId,
            nama: record.nama,
            checkIn: format(record.checkIn, 'yyyy-MM-dd HH:mm:ss', { timeZone }),
            checkOut: record.checkOut ? format(record.checkOut, 'yyyy-MM-dd HH:mm:ss', { timeZone }) : 'N/A'
        }));

        res.status(200).json({
            message: "Laporan presensi berhasil diambil",
            count: formattedRecords.length,
            data: formattedRecords,
        });

    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};
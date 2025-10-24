const { Presensi } = require('../models');
const { Op } = require('sequelize');
const { format } = require('date-fns-tz');
const timeZone = "Asia/Jakarta";

exports.getDailyReport = async (req, res) => {
    try {
        const today = new Date();

        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const dailyRecords = await Presensi.findAll({
            where: {
                checkIn: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            },
            order: [['checkIn', 'DESC']]
        });

        if (dailyRecords.length === 0) {
            return res.status(200).json({ 
                message: "Tidak ada catatan presensi hari ini.",
                data: []
            });
        }

        const formattedReport = dailyRecords.map(record => ({
            userId: record.userId,
            nama: record.nama,
            checkIn: format(record.checkIn, "yyyy-MM-dd HH:mm:ss", { timeZone }),
            checkOut: record.checkOut ? format(record.checkOut, "yyyy-MM-dd HH:mm:ss", { timeZone }) : 'N/A'
        }));

        res.status(200).json({
            message: `Laporan presensi untuk tanggal ${format(today, "yyyy-MM-dd", { timeZone })} berhasil diambil.`,
            count: formattedReport.length,
            data: formattedReport
        });
    } catch (error) {
        console.error('Error fetching daily report:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil laporan.", error: error.message });
    }
};
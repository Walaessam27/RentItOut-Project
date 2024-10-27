const express = require('express');
const router = express.Router();
const { Rental, Item } = require('../models');  // استيراد النماذج (models)

// دالة حساب السعر الإجمالي بناءً على عدد الأيام والكمية
const calculateTotalPrice = (pricePerDay, dateFrom, dateTo, quantity) => {
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    const rentalDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)); // حساب عدد الأيام بين تاريخين
    return pricePerDay * rentalDays * quantity;
};

// مسار GET لجلب جميع البيانات من جدول rental
router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.findAll();  // جلب جميع السجلات من جدول rental
        res.json(rentals);  // إرسال السجلات كـ JSON في الاستجابة
    } catch (error) {
        console.error('Error fetching rentals: ', error);
        res.status(500).json({ error: 'Failed to fetch rentals' });
    }
});

// مسار POST لمعالجة طلبات الإيجار
router.post('/rent', async (req, res) => {
    try {
        const { itemId, renterId, dateFrom, dateTo, quantity } = req.body;

        // البحث عن الأداة المستأجرة
        const item = await Item.findByPk(itemId);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // حساب السعر الإجمالي باستخدام دالة calculateTotalPrice
        const totalPrice = calculateTotalPrice(item.price, dateFrom, dateTo, quantity);

        // إنشاء سجل إيجار جديد
        const rental = await Rental.create({
            item_id: itemId,
            renter_id: renterId,
            owner_id: item.owner_id,
            total_price: totalPrice,
            quantity,
            date_from: dateFrom,
            date_to: dateTo,
            location: item.location,
            state: 'pending'
        });

        res.status(201).json(rental);  // استجابة مع بيانات الإيجار الجديدة
    } catch (error) {
        console.log('Error while processing rental:', error);
        res.status(500).json({ error: 'Failed to process rental' });
    }
});

module.exports = router;

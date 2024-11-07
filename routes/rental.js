const express = require('express');
const router = express.Router();
const { Rental, Item, Review, Payment, User } = require('../models'); 
const nodemailer = require('nodemailer');

const sendEmail = async (recipientEmail, subject, text, html) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'kaseel134@gmail.com',
            pass: 'vpww wnlp zwzi jkpl', 
        },
        tls: {
            rejectUnauthorized: false,
        }
    });

    const mailOptions = {
        from: 'kaseel134@gmail.com',
        to: recipientEmail,
        subject: subject,
        text: text,
        html: html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};




const calculateTotalPrice = (pricePerDay, dateFrom, dateTo, quantity) => {
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    const rentalDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)); 
    return pricePerDay * rentalDays * quantity;
};



router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.findAll();
        res.json(rentals);
    } catch (error) {
        console.error('Error fetching rentals:', error); 
        res.status(500).json({ error: 'Failed to fetch rentals' });
    }
});

router.put('/rent', async (req, res) => {
    try {
        const { itemId, renterId, dateFrom, dateTo, quantity, renterEmail } = req.body;

        const item = await Item.findByPk(itemId);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        if (item.quantity < quantity) {
            return res.status(400).json({ error: 'Not enough quantity available' });
        }

        const totalPrice = calculateTotalPrice(item.price, dateFrom, dateTo, quantity);

        const rental = await Rental.create({
            item_id: itemId,
            renter_id: renterId,
            owner_id: item.owner_id,
            total_price: totalPrice,
            quantity,
            date_from: dateFrom,
            date_to: dateTo,
            location: item.location,
            state: 'pending', 
            renter_email: renterEmail 
        });

        await item.update({ quantity: item.quantity - quantity });

        await sendEmail(
            renterEmail, 
           'Rental Confirmation', 
    'Your rental has been confirmed successfully!', 
    '<strong>Your rental has been confirmed successfully!</strong>'
        );

        const owner = await User.findByPk(item.owner_id);
        if (owner) {
            const ownerEmail = owner.email; 
            await sendEmail(
                ownerEmail,
                'New Rental Request', 
`A new rental request has been made for the item: ${item.name}.`, 
`<strong>A new rental request has been made for the item:</strong> <pre>${JSON.stringify(rental, null, 2)}</pre>` 

            );
        }

        res.status(201).json(rental);
    } catch (error) {
        console.error('Error while processing rental:', error);
        res.status(500).json({ error: 'Failed to process rental' });
    }
});
router.put('/confirm-rent/:rentalId', async (req, res) => {
    try {
        const { rentalId } = req.params;

        const rental = await Rental.findByPk(rentalId);
        if (!rental) {
            return res.status(404).json({ error: 'Rental not found' });
        }

        rental.state = 'confirmed'; 
        await rental.save(); 

        const subjectToRenter = 'Rental Confirmation'; 
const textToRenter = `Your rental has been approved: ${JSON.stringify(rental)}`; 
const htmlToRenter = `<strong>Your rental has been approved:</strong> <pre>${JSON.stringify(rental, null, 2)}</pre>`; 
        
        await sendEmail(rental.renter_email, subjectToRenter, textToRenter, htmlToRenter);

        const item = await Item.findByPk(rental.item_id);
        if (item) {
            const subjectToOwner = 'New Rental Request'; 
            const textToOwner = `A new rental request has been made for the item: ${item.name}.`; 
            const htmlToOwner = `<strong>A new rental request has been made for the item:</strong> <pre>${JSON.stringify(rental, null, 2)}</pre>`; 
            
            await sendEmail(item.owner_email, subjectToOwner, textToOwner, htmlToOwner);
        }

        res.status(200).json({ message: 'Rental confirmed successfully', rental });
    } catch (error) {
        console.error('Error confirming rental:', error);
        res.status(500).json({ error: 'Failed to confirm rental' });
    }

    console.log('Confirming rental with ID:', rentalId);

});

router.post('/update-rent', async (req, res) => {
    try {
        const { rentalId, newDateFrom, newDateTo, newQuantity } = req.body;

        const rental = await Rental.findByPk(rentalId);
        if (!rental) {
            return res.status(404).json({ error: 'Rental not found' });
        }

        const item = await Item.findByPk(rental.item_id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const quantityDifference = newQuantity - rental.quantity;
        if (item.quantity < quantityDifference) {
            return res.status(400).json({ error: 'Not enough quantity available for update' });
        }

        await item.update({ quantity: item.quantity - quantityDifference });

        const newTotalPrice = calculateTotalPrice(item.price, newDateFrom, newDateTo, newQuantity);

        await rental.update({
            date_from: newDateFrom,
            date_to: newDateTo,
            quantity: newQuantity,
            total_price: newTotalPrice
        });

        res.status(200).json(rental);
    } catch (error) {
        console.error('Error updating rental:', error);
        res.status(500).json({ error: 'Failed to update rental' });
    }
});


router.put('/review', async (req, res) => {
    try {
        const { rentalId, review } = req.body;

        const rental = await Rental.findByPk(rentalId);
        if (!rental) {
            return res.status(404).json({ error: 'Rental not found' });
        }

        await rental.update({ review });

        res.status(200).json({ message: 'Review updated successfully', rental });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
});

router.delete('/delete-rent/:rentalId', async (req, res) => {
    try {
        const { rentalId } = req.params;
        const { quantityToRemove } = req.body; 

        const rental = await Rental.findByPk(rentalId);
        if (!rental) {
            return res.status(404).json({ error: 'Rental not found' });
        }

        if (quantityToRemove > rental.quantity) {
            return res.status(400).json({ error: 'Quantity to remove exceeds the rental quantity' });
        }

        const item = await Item.findByPk(rental.item_id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const pricePerUnit = item.price;

        const rentalDays = Math.ceil((new Date(rental.date_to) - new Date(rental.date_from)) / (1000 * 60 * 60 * 24));
        const totalRentalPrice = pricePerUnit * rentalDays * rental.quantity; 
        if (rental.state === 'confirmed') {
            const totalDeduction = pricePerUnit * quantityToRemove; 
            const totalPenalty = (pricePerUnit * 0.10) * quantityToRemove; 
            
            rental.total_price -= (totalDeduction + totalPenalty); 
        }

        await item.update({ quantity: item.quantity + quantityToRemove }); 

        rental.quantity -= quantityToRemove;

        if (rental.quantity <= 0) {
            rental.state = 'cancelled';
        }

        await rental.save(); 

        res.status(200).json({ message: 'Rental canceled successfully', rental });
    } catch (error) {
        console.error('Error deleting rental:', error);
        res.status(500).json({ error: 'Failed to cancel rental' });
    }
});


module.exports = router;


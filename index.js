const express = require('express');
const sequelize = require('./db');
const itemsRoute = require('./routes/items'); // Items route
const searchRoute = require('./routes/search'); // Search route
//const rentalRoutes = require('./routes/rentalRoutes'); 
const paymentRoutes = require('./routes/payment');
const securityRoutes = require('./routes/security');
const authRoute = require('./routes/auth'); 
//const ratingRoutes = require('./routes/RatingRoutes'); // Adjust path if needed 
const rentalRoute = require('./routes/rental');

//const authenticateToken = require('./middlewares/authMid');



const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json()); 
app.use('/api/items', itemsRoute);  // Item routes
app.use('/api/search', searchRoute);  // Search routes
//app.use('/api/rent', rentalRoutes);
app.use('/api/payments', paymentRoutes);

app.use('/api/security', securityRoutes);
app.use('/api/auth', authRoute);
//app.use('/api/rate', ratingRoutes); // Rate routes 
app.use('/api/rental', rentalRoute);



//app.use('/api/rental', authenticateToken, rentalRoute);  // an example for Protect rental routes


sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




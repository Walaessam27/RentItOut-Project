const express = require('express');
const sequelize = require('./db');
const itemsRoute = require('./routes/items'); // Items route
const searchRoute = require('./routes/search'); // Search route
const RatingRoutes = require('./routes/RatingRoutes'); // Adjust path if needed 
const rentalRoute = require('./routes/rental');
const paymentRoute = require('./routes/payment');

const authRoute = require('./routes/auth'); 
//const authenticateToken = require('./middlewares/authMid');



const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json()); 
app.use('/api/items', itemsRoute);  // Item routes
app.use('/api/search', searchRoute);  // Search routes
app.use('/api/rate', RatingRoutes); // Rate routes 
app.use('/api/rental', rentalRoute);
app.use('/api/payments', paymentRoute);
app.use('/api/auth', authRoute);

//app.use('/api/rental', authenticateToken, rentalRoute);  // an example for Protect rental routes


sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




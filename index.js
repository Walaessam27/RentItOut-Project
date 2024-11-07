const express = require('express');
const sequelize = require('./db');
const itemsRoute = require('./routes/items'); 
const searchRoute = require('./routes/search'); 
const paymentRoutes = require('./routes/payment');
const securityRoutes = require('./routes/security');
const authRoute = require('./routes/auth'); 
const rentalRoute = require('./routes/rental');


const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json()); 
app.use('/api/items', itemsRoute);  
app.use('/api/search', searchRoute);  
app.use('/api/payments', paymentRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/auth', authRoute);
app.use('/api/rental', rentalRoute);

sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




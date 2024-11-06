const express = require('express');
const sequelize = require('./db');

const itemsRoute = require('./routes/items'); 
const searchRoute = require('./routes/search'); 
const rentalRoute = require('./routes/rental');
const paymentRoute = require('./routes/payment');

const authRoute = require('./routes/auth'); 
//const authenticateToken = require('./middlewares/authMid');



const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json()); 

app.use('/api/items', itemsRoute);  
app.use('/api/search', searchRoute);  
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




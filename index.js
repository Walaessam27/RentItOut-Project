const express = require('express');
const sequelize = require('./db');
const itemsRoute = require('./routes/items'); // Items route
const searchRoute = require('./routes/search'); // Search route

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use('/api/items', itemsRoute);  // Item routes
app.use('/api/search', searchRoute);  // Search routes

sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

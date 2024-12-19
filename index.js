require('dotenv').config();
const express = require('express');
const projekRoutes = require('./routes/projek');
const pesananRoutes = require('./routes/pesanan');
const { pool, testConnection } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

testConnection();
app.use((req, res, next) => {
    req.pool = pool;
    next();
});

app.use('/api/projek', projekRoutes);
app.use('/api/pesanan', pesananRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

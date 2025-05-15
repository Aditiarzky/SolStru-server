require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const cookieParser = require('cookie-parser');
const projectRoutes = require('./routes/projectRoute');
const orderRoutes = require('./routes/orderRoute');
const authRoutes = require('./routes/authRoute');
const notificationRoutes = require('./routes/notificationRoute');
const loggedInUserRoutes = require('./routes/loggedInUserRoute');
const userRoutes = require('./routes/userRoute');
const pool = require('./db');

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = ['http://localhost:5173','http://localhost:5174', 'https://nama-domain-kamu.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    req.pool = pool;
    next();
});

app.use('/api/project', projectRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/me', loggedInUserRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

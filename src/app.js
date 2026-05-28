const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const apiV1Routes = require('./routes/api/v1');
const apiV2Routes = require('./routes/api/v2');
const userRoutes = require('./routes/user');
const platRoutes = require('./routes/plat');
const vendorRoutes = require('./routes/vendor');
const errorHandler = require('./middlewares/errorHandler');
const gameAdapter = require('./routes/gameAdapter');

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Routes
app.use('/api', apiV1Routes);
app.use('/api/v2', apiV2Routes);
app.use('/user', userRoutes);
app.use('/plat', platRoutes);
app.use('/vendor', vendorRoutes);

app.use(gameAdapter);

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Error handler
app.use(errorHandler);

module.exports = app;

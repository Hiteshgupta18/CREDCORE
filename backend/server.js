require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const hospitalRoutes = require('./routes/hospital.routes');
const addressRoutes = require('./routes/address.routes');
const schemeRoutes = require('./routes/scheme.routes');
const validationRoutes = require('./routes/validation.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/validations', validationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CrediCore API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      hospitals: '/api/hospitals',
      addresses: '/api/addresses',
      schemes: '/api/schemes',
      validations: '/api/validations'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🏥 CrediCore Backend Server       ║
║                                       ║
║   Server: http://localhost:${PORT}     ║
║   Environment: ${process.env.NODE_ENV || 'development'}              ║
║   Status: ✅ Running                  ║
╚═══════════════════════════════════════╝
  `);
});

module.exports = app;

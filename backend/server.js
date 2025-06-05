require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventsRoutes');
const commentRoutes = require('./routes/commentsRoutes');
const categoryRoutes = require('./routes/categories');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Handle Sequelize errors
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Validation error',
                details: err.errors.map(e => e.message)
            }
        });
    }
    
    // Handle JWT authentication errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: {
                message: 'Invalid token',
                code: 'INVALID_TOKEN'
            }
        });
    }

    // Default error response
    res.status(500).json({
        success: false,
        error: {
            message: 'Internal server error',
            code: 'INTERNAL_ERROR'
        }
    });
});

const PORT = process.env.PORT || 5000;

// Database connection and server start
async function startServer() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✓ Database connection established successfully');
        
        // Sync database in development
        if (process.env.NODE_ENV !== 'production') {
            try {
                await sequelize.sync();
                console.log('✓ Database synchronized successfully');
            } catch (syncError) {
                console.error('× Database synchronization failed:', syncError);
                process.exit(1);
            }
        }

        // Start server
        app.listen(PORT, () => {
            console.log(`✓ Server is running on port ${PORT}`);
            console.log(`  - API Documentation: http://localhost:${PORT}/api-docs`);
            console.log(`  - Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('× Failed to start server:');
        console.error('  - Database connection failed:', error.message);
        
        if (error.original) {
            console.error('  - Original error:', error.original.sqlMessage || error.original);
        }
        
        console.log('\nTroubleshooting steps:');
        console.log('1. Check if MySQL server is running');
        console.log('2. Verify database credentials in .env file');
        console.log('3. Ensure database exists and is accessible');
        
        process.exit(1);
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
    // Don't exit the process in production
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});

startServer(); 
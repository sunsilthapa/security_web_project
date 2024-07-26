const winston = require('winston');
require('winston-mongodb');

// Configure Winston to log into MongoDB
const logger = winston.createLogger({
    transports: [
        new winston.transports.MongoDB({
            db: process.env.DB_URI,
            collection: 'auditLogs',
            level: 'info',
            options: { useUnifiedTopology: true }
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
});

// Log user activities
function logActivity(userId, action, details) {
    logger.info({
        userId,
        action,
        details,
        timestamp: new Date().toISOString()
    });
}

module.exports = logActivity;

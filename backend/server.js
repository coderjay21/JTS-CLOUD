require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db'); 

const PORT = process.env.PORT || 8000;

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down server runtime context...');
    console.error(err.name, err.message);
    process.exit(1);
});

let server;

connectDB().then(() => {
    server = app.listen(PORT, () => {
        console.log(`[JTS-CLOUD] Production Engine executing perfectly on port ${PORT} 🚀`);
    });
}).catch(err => {
    console.error('Database bootstrap failed! ❌', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 System hot-swapping down gracefully...');
    console.error(err.name, err.message);
    if (server) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM process interrupt signal received. Safe exit sequence initiated.');
    if (server) {
        server.close(() => console.log('Process gracefully completed!'));
    }
});
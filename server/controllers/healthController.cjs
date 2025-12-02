const mongoose = require('mongoose');
const { connectDB } = require('../config/database.cjs');

const healthCheck = async (req, res) => {
  try {
    const readyState = mongoose.connection.readyState;

    if (readyState !== 1) {
      try {
        await connectDB();
      } catch (e) {
        // ignore; will report below
      }
    }

    const connected = mongoose.connection.readyState === 1;

    return res.json({
      success: connected,
      connected,
      readyState: mongoose.connection.readyState,
      mongodb: {
        connected,
        host: mongoose.connection.host || null,
        database: mongoose.connection.name || null,
      },
      host: mongoose.connection.host || null,
      database: mongoose.connection.name || null,
      hasMongoURI: !!process.env.MONGODB_URI,
      message: connected ? 'MongoDB 연결됨' : 'MongoDB 연결 안됨',
    });
  } catch (error) {
    return res.json({
      success: false,
      connected: false,
      readyState: mongoose.connection.readyState || 0,
      mongodb: { connected: false },
      error: error.message,
    });
  }
};

module.exports = { healthCheck };

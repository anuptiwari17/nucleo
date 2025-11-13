const express = require('express');
const router = express.Router();
const pool = require('../db'); // same pool setup as in other routes
require('dotenv').config();

/* 
  Middleware to block all non-GET methods.
  This executes before any route handler below.
*/
router.use((req, res, next) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed. Only GET or HEAD are supported.'
    });
  }
  next();
});


// GET /api/keep-alive?token=yourtoken
router.get('/', async (req, res) => {
  try {
    const { token } = req.query;

    // Validate token
    if (!token || token !== process.env.KEEP_ALIVE_TOKEN) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid or missing token',
      });
    }

    // Run a lightweight query to keep Supabase (Postgres) alive
    const result = await pool.query('SELECT NOW()');

    res.status(200).json({
      success: true,
      message: 'Server and database are alive',
      server_time: new Date().toISOString(),
      db_time: result.rows[0].now,
    });

  } catch (error) {
    console.error('Error in keep-alive route:', error);
    res.status(500).json({
      success: false,
      message: 'Keep-alive check failed',
      error: error.message,
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');


router.post('/assign', async (req, res) => {
  const {
    title,
    description,
    priority,
    due_date,
    assigned_by,
    assigned_to,
    organization_id
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tasks 
        (title, description, priority, due_date, assigned_by, assigned_to, organization_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, priority, due_date, assigned_by, assigned_to, organization_id]
    );

    res.status(201).json({ task: result.rows[0] });
  } catch (err) {
    console.error("Error assigning task:", err.message);
    res.status(500).json({ error: "Server error assigning task" });
  }
});

module.exports = router;

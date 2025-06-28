const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});



router.post("/create-manager", async (req, res) => {
  const { full_name, email, department, password, organization_id } = req.body;

  if (!full_name || !email || !department || !organization_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password || "manager123", 10); // Default password fallback

    const newManager = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, department, organization_id)
       VALUES ($1, $2, $3, 'manager', $4, $5) RETURNING *`,
      [full_name, email.toLowerCase(), hashedPassword, department, organization_id]
    );

    res.status(201).json({
      message: "Manager created successfully",
      manager: newManager.rows[0],
    });
  } catch (err) {
    console.error("Error creating manager:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});



//isme ye saare comments jaruri hai for reason warna bbad me samajh nhi aayega kyu kiya
router.post("/create-employee", async (req, res) => {

  console.log("Request backend me aa chuki hai");

  const {
    full_name,
    email,
    position,
    password,
    manager_id,
    organization_id
  } = req.body;

  //Validate input
  if (!full_name || !email || !position || !manager_id || !organization_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    //Hash password (fallback: emp123)
    const hashedPassword = await bcrypt.hash(password || "emp123", 10);

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    //Check for duplicate email
    const existingUser = await pool.query("SELECT * FROM users WHERE LOWER(email) = $1", [normalizedEmail]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    //Insert new employee
    const result = await pool.query(
      `INSERT INTO users (
        full_name, email, password_hash, role,
        position, manager_id, organization_id
      ) VALUES ($1, $2, $3, 'employee', $4, $5, $6)
      RETURNING id, full_name, email, role, position, manager_id`,
      [full_name, normalizedEmail, hashedPassword, position, manager_id, organization_id]
    );

    res.status(201).json({
      message: "Employee created successfully",
      employee: result.rows[0]
    });

    console.log("Backend se DB me employee insert ho gaya hai!!!");

  } catch (err) {
    console.error("🔥 Error in create-employee route:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});





router.get("/manager/:managerId", async (req, res) => {
  try {
    const { managerId } = req.params;
    const result = await pool.query(
      "SELECT * FROM users WHERE manager_id = $1",
      [managerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});



// GET /api/users/managers/:organizationId - Fetch all managers in an organization
router.get('/managers/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;

    const query = `
      SELECT 
        id,
        full_name,
        email,
        department,
        position,
        created_at
      FROM users 
      WHERE organization_id = $1 
        AND role = 'manager'
      ORDER BY full_name ASC
    `;

    const result = await pool.query(query, [organizationId]);

    // Count employees for each manager
    const managersWithEmployeeCount = await Promise.all(
      result.rows.map(async (manager) => {
        const employeeCountQuery = `
          SELECT COUNT(*) 
          FROM users 
          WHERE organization_id = $1 
            AND manager_id = $2 
            AND role = 'employee'
        `;
        const countResult = await pool.query(employeeCountQuery, [organizationId, manager.id]);
        return {
          ...manager,
          employee_count: parseInt(countResult.rows[0].count, 0)
        };
      })
    );

    res.status(200).json({
      success: true,
      managers: managersWithEmployeeCount
    });

  } catch (error) {
    console.error('Error fetching managers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch managers',
      error: error.message
    });
  }
});





// GET /api/users/employees/:organizationId - Fetch employees under a manager
router.get('/employees/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { manager_id } = req.query;

    if (!manager_id) {
      return res.status(400).json({
        success: false,
        message: 'manager_id is required as query parameter'
      });
    }

    const query = `
      SELECT 
        id,
        full_name,
        email,
        department,
        position,
        created_at
      FROM users 
      WHERE organization_id = $1 
        AND manager_id = $2 
        AND role = 'employee'
      ORDER BY full_name ASC
    `;

    const result = await pool.query(query, [organizationId, manager_id]);

    res.status(200).json({
      success: true,
      employees: result.rows
    });

  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error.message
    });
  }
});



module.exports = router;

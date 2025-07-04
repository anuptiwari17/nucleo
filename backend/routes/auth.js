const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  console.log("LOGIN ATTEMPT:", normalizedEmail);

  try {
    //Check if DB is connected and env is loaded
    console.log("Checking DATABASE_URL:", process.env.DATABASE_URL);

    const userRes = await pool.query("SELECT * FROM users WHERE LOWER(email) = $1", [normalizedEmail]);

    console.log("Query Result:", userRes.rows);

    const user = userRes.rows[0];
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: "User not found" });
    }

    console.log("Comparing password:", password, "with hash:", user.password_hash);

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      console.log("Password mismatch");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("Password matched");

    res.json({
      id: user.id,
      full_name: user.full_name,
      role: user.role,
      organization_id: user.organization_id,
    });

    console.log("User logged in:", user.email);

  } catch (err) {
    console.error("FULL SERVER ERROR:", err);
    res.status(500).send("Server error");
  }
});



router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase();
  console.log("FORGOT PASSWORD REQUEST:", normalizedEmail);
  try {
    const userRes = await pool.query("SELECT * FROM users WHERE LOWER(email) = $1", [normalizedEmail]);
    const user = userRes.rows[0];

    if (!user) {
      console.log("User not found for email:", normalizedEmail);
      return res.status(404).json({ error: "User not found" });
    }

    //abhi nhi bana hai ye functionality
    //to implement - either build ur own using any email service or use nodemailer or migrate auth service to supabase auth

    console.log(`Password reset link sent to ${normalizedEmail}`);
    console.log("Will implement forgotpassword functionality later");

    res.json({ message: "Password reset link sent to your email" });

  } catch (err) {
    console.error("Error in forgot-password route:", err);
    res.status(500).json({ error: "Server error" });
  }

});






// signup route
router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, organizationName, role } = req.body;
  
  try {
    // Start transaction
    await pool.query('BEGIN');
    
    // creating organization first
    const orgResult = await pool.query(
      "INSERT INTO organizations (name) VALUES ($1) RETURNING id",
      [organizationName]
    );
    const organizationId = orgResult.rows[0].id;
    
    // creating user with organization reference - yhi process thik rahega!!
    const fullName = `${firstName} ${lastName}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await pool.query(
      "INSERT INTO users (full_name, email, password_hash, role, organization_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [fullName, email, hashedPassword, role, organizationId]
    );

    // Commit transaction
    await pool.query('COMMIT');

    res.status(201).json({
      id: newUser.rows[0].id,
      full_name: newUser.rows[0].full_name,
      role: newUser.rows[0].role,
      organization_id: newUser.rows[0].organization_id,
      message: "Organization and user created successfully"
    });
    
  } catch (err) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    
    console.error("Signup error:", err.message);
    
    
    if (err.code === '23505') {
      if (err.constraint === 'organizations_name_key') {
        return res.status(400).json({ message: "Organization name already exists" });
      }
      if (err.constraint === 'users_email_key') {
        return res.status(400).json({ message: "Email already exists" });
      }
    }
    
    res.status(500).json({ message: "Server error during signup" });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

// login routee
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();


  try {
    const userRes = await pool.query("SELECT * FROM users WHERE LOWER(email) = $1", [normalizedEmail]);
    const user = userRes.rows[0];

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: "User not found" });
    }

    console.log("Found user:", user.email);
    console.log("Comparing password:", password, "with hash:", user.password_hash);

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      console.log("Passwordawa match nhi hua");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("Password matched");

    res.json({
      id: user.id,
      full_name: user.full_name,
      role: user.role,
      organization_id: user.organization_id,
    });

    console.log("User logged in successfully:", user.email);

  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

// signup route
router.post("/signup", async (req, res) => {
  const { full_name, email, password, role, organization_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (full_name, email, password_hash, role, organization_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [full_name, email, hashedPassword, role, organization_id]
    );

    res.status(201).json({
      id: newUser.rows[0].id,
      full_name: newUser.rows[0].full_name,
      role: newUser.rows[0].role,
      organization_id: newUser.rows[0].organization_id,
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).send("Server error");
  }
});







module.exports = router;

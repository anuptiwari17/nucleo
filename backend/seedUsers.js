const bcrypt = require("bcrypt");
const pool = require("./db");

async function insertUsers() {
    
  // Trying to get the organization first

let org = await pool.query("SELECT id FROM organizations WHERE name = $1", ["NucleoOrg"]);

let orgId;
if (org.rows.length > 0) {
  orgId = org.rows[0].id;
  console.log("Org already exists. Using existing org ID:", orgId);
} else {

  // Insert if not exists
  const insertOrg = await pool.query(
    "INSERT INTO organizations(name) VALUES($1) RETURNING id", 
    ["NucleoOrg"]
  );
  orgId = insertOrg.rows[0].id;
  console.log("Inserted new org with ID:", orgId);
}


  const users = [
    {
      name: "Anup Admin",
      email: "admin@nucleo.com",
      password: "admin123",
      role: "admin",
      department: null,
      position: null
    },
    {
      name: "Manager One",
      email: "manager@nucleo.com",
      password: "manager123",
      role: "manager",
      department: "Engineering",
      position: null
    },
    {
      name: "Employee One",
      email: "employee@nucleo.com",
      password: "emp123",
      role: "employee",
      department: null,
      position: "Developer"
    }
  ];

  for (let user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await pool.query(
      `INSERT INTO users (organization_id, full_name, email, password_hash, role, department, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [orgId, user.name, user.email, hashedPassword, user.role, user.department, user.position]
    );
  }

  console.log("Users inserted successfully");
}

insertUsers();

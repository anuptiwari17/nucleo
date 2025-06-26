const bcrypt = require("bcrypt");
const pool = require("./db");

async function insertUsers() {
  const password = await bcrypt.hash("admin123", 10);
  const org = await pool.query("INSERT INTO organizations(name) VALUES($1) RETURNING id", ["NucleoOrg"]);
  const orgId = org.rows[0].id;

  const users = [
    ["Anup Admin", "admin@nucleo.com", password, "admin", null, null],
    ["Manager One", "manager@nucleo.com", password, "manager", "Engineering", null],
    ["Employee One", "employee@nucleo.com", password, "employee", null, "Developer"]
  ];

  for (let [name, email, hash, role, dept, pos] of users) {
    await pool.query(
      `INSERT INTO users (organization_id, full_name, email, password_hash, role, department, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [orgId, name, email, hash, role, dept, pos]
    );
  }

  console.log("Users inserted");
}

insertUsers();

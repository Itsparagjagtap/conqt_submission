const express = require("express");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

app.get("/api/getVendorUsers", async (req, res) => {
  const { prId, custOrgId } = req.query;

  if (!prId || !custOrgId) {
    return res
      .status(400)
      .json({ error: "missing prId or custOrgId parameter" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = `
      SELECT DISTINCT 
        vu.VendorOrganizationId AS supplierId, 
        vu.UserName, 
        vu.Name
      FROM PrLineItems pli
      JOIN VendorUsers vu 
        ON FIND_IN_SET(vu.VendorOrganizationId, pli.suppliers) > 0
      WHERE pli.purchaseRequestId = ? 
        AND pli.custOrgId = ? 
        AND vu.Role = 'Admin';
    `;

    const [rows] = await connection.execute(query, [prId, custOrgId]);

    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error("Error fetching vendor users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

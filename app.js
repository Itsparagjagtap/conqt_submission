const express = require("express");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "candidate",
  password: "NoTeDeSt^C10.6?SxwY882}",
  database: "conqtvms_dev",
});

connection.connect((err) => {
  if (err) {
    return console.log("Error occurred during connection");
  }

  console.log(`connected as id` + connection.threadId);
});

const app = express();

app.get("/", (req, res) => {
  res.send("This is Home Page");
});

app.get("/api/getVendorUsers", (req, res) => {
  const prId = req.query.prId;
  const custOrgId = req.query.custOrgId;

  const data =
    connection.query(`select suppliers, custOrgId, purchaseRequestId from PrLineItem
    `);
  return data;
});

connection.end();
app.listen(3000, () => {
  console.log("server is listening on port 3000");
});

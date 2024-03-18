const express = require("express");
const bodyParser = require("body-parser");
const {
  generateCookie,
  openGate,
  gateStatus,
} = require("./services/beresident");

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post("/api/generatecookie", async (req, res) => {
  console.log("Request body: ", req.body);
  try {
    const { user, password } = req.body;
    const cookie = await generateCookie(user, password);
    res.json({ cookie }); //even if wrong credentials are sent, the response will be a cookie
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/opengate", async (req, res) => {
  const { token, id } = req.body; // Assuming user and password are sent in the request body
  try {
    const ogResponse = await openGate(token, id);
    if (ogResponse.code === "error") {
      throw new Error(ogResponse.message);
    }
    try {
      const gsResponse = await gateStatus(token, id);
      res.json(gsResponse);
    } catch (error) {
      res.status(501).json(error.message);
    }
  } catch (error) {
    res.status(502).json(error.message);
  }
});

app.get("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

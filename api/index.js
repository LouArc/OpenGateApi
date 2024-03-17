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
  try {
    const { user, password } = req.body;
    const cookie = await generateCookie(user, password);
    res.json({ cookie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/opengate", (req, res) => {
  const { token, id } = req.body; // Assuming user and password are sent in the request body
  openGate(token, id)
    .then(() => {
      //call our gateStatus function
      gateStatus(token, id)
        .then((status) => {
          res.json({ message: status });
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// app.post("/api/gateStatus", (req, res) => {
//   const { token, id } = req.body; // Assuming user and password are sent in the request body
//   gateStatus(token, id)
//     .then((status) => {
//       res.json({ message: status });
//     })
//     .catch((error) => {
//       res.status(500).json({ error: error.message });
//     });
// });

app.get("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

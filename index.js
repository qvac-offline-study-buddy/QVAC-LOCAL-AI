import express from "express";

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());
app.get("/", (req, res) => {
  res.send(`
    <h1>QVAC Local AI</h1>
    <p>Local AI app is running.</p>
  `);
});
app.listen(PORT, () => {
  console.log(`QVAC Local AI running on port ${PORT}`);
});
import path from "path";
import express from "express";

const app = express();
const port = process.env.PORT || 5173;

app.use(express.static(path.join(__dirname, "..")));

app.listen(port, () => console.log(`App listening on port ${port}!`));

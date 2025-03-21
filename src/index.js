const express = require("express");
const fs = require("fs");
const cors = require("cors");
const ytdl = require("@distube/ytdl-core");
const path = require("path");

require("dotenv").config();

const app = express();
const publicPath = path.join(__dirname, "../public");
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/download", async (req, res) => {
  const songsPath = path.join(__dirname, "../public/songs");
  if (!fs.existsSync(songsPath)) {
    fs.mkdirSync(songsPath, { recursive: true });
  }
  const info = await ytdl.getInfo(req.body.url);
  const name = new Date().getTime();
  ytdl(req.body.url, {
    quality: "highestaudio",
  }).pipe(fs.createWriteStream(`public/songs/${name}.mp3`));
  res.json({
    ...info.player_response.videoDetails,
    url: `/songs/${name}.mp3`,
  });
});

app.post("/delete", (req, res) => {
  fs.unlinkSync(path.join(__dirname, `../public${req.body.url}`));
  res.json({ message: "Deleted highestaudio.mp3" });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${3001}`);
});

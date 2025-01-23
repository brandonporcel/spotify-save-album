import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import saveAlbums from "./actions/save-albums";
import { authCallback } from "./controllers";

dotenv.config();

const app = express();
const CLIENT_ID = process.env.CLIENT_ID || "";
const PORT = process.env.PORT || 8888;
const redirect_uri =
  process.env.REDIRECT_URI || `http://localhost:${PORT}/callback`;

app.set("view engine", "ejs");
app.set("views", __dirname + "/../views");

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.render("index");
});

app.get("/login", (_req, res) => {
  const scope =
    "user-library-read user-read-private user-read-email user-library-modify";
  const stateParam = Math.random().toString(36).substring(7);

  const url = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope,
    redirect_uri,
    state: stateParam,
  }).toString()}`;

  res.redirect(url);
});

app.get("/callback", async (req: any, res: any) => {
  try {
    const { access_token } = await authCallback(req);
    res.render("callback", { access_token });
  } catch (error) {
    console.error("Error during callback processing:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/save", async (req, res) => {
  try {
    const albums = JSON.parse(req.body.albums);
    const final = await saveAlbums(albums);

    res.render("save", { saved: final.toSave, unFound: final.unFoundAlbums });
  } catch (error) {
    console.error("Error guardando álbumes:", error);
    res.status(500).send("Error procesando los álbumes.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

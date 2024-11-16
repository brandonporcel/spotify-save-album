import express from "express";
import dotenv from "dotenv";
import { authCallback, redirectToSpotifyAuth } from "./controllers";
dotenv.config();

// 📀🎧📀🎧📀🎧📀🎧📀🎧📀🎧📀🎧📀🎧
const ALBUMS: string[] = [];

const app = express();
const PORT = process.env.PORT || 8888;
app.use(express.json());

const main = async () => {
  redirectToSpotifyAuth();
};

app.get("/callback", authCallback);

app.listen(PORT);
main();

export { ALBUMS };

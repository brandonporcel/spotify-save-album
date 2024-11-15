import { Request, Response } from "express";
import color from "picocolors";
import axios from "axios";
import { generateRandomString } from "../utils";
import { AxiosRequestConfig } from "axios";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { setSdk } from "../helpers/sdkManager";
import saveAlbums from "../actions/save-albums";
import dotenv from "dotenv";
dotenv.config();

const { CLIENT_ID, PORT = 8888 } = process.env;
const redirect_uri = `http://localhost:${PORT}/callback`;

export const redirectToSpotifyAuth = () => {
  const scope =
    "user-library-read user-read-private user-read-email user-library-modify";
  const stateParam = generateRandomString(16);
  const url = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID ?? "",
    scope,
    redirect_uri,
    state: stateParam,
  }).toString()}`;
  console.log(color.magenta("📀🎧 Spotify CLI - Save Albums 🎧📀"));
  console.log(color.gray("--------------------------------------------------"));
  console.log(
    color.bgGreen(color.black(" Welcome to the Bulk Album Saver Application! "))
  );
  console.log(
    color.gray("--------------------------------------------------\n")
  );
  console.log(color.green("🔗 To authorize, visit the following URL:\n"));
  console.log(color.blue(url));
  console.log("\n");
};

export const authorizeUser = async (code: string) => {
  const authOptions: AxiosRequestConfig = {
    url: "https://accounts.spotify.com/api/token",
    method: "post",
    data: new URLSearchParams({
      code: code,
      redirect_uri,
      grant_type: "authorization_code",
    }).toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  };

  const { data } = await axios(authOptions);
  return data;
};

export const authCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const state = req.query.state as string;

  if (!state) {
    return res.redirect(
      "/#" + new URLSearchParams({ error: "state_mismatch" }).toString()
    );
  }

  try {
    const authData = await authorizeUser(code);
    const access_token = authData.access_token;
    res.json({ access_token });
    const sdk = SpotifyApi.withAccessToken("client_id", authData);
    setSdk(sdk);
    console.log(color.green("✅ Successfully authenticated with Spotify API."));
    await saveAlbums();
  } catch (error: any) {
    console.error(color.red(`❌ Error during callback: ${error.message}`));
    res.status(500).send("Error during authentication callback");
  }
};

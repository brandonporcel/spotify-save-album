import dotenv from "dotenv";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import color from "picocolors";
import { refreshTtoken } from "./utils";
import { setSdk } from "./helpers/sdkManager";
import saveAlbums from "./actions/save-albums";
dotenv.config();

const ALBUMS: string[] = [];

const credentials = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  refresh_token: process.env.REFRESH_TOKEN,
};

const main = async () => {
  if (ALBUMS.length === 0) return;
  console.log(color.magenta("📀🎧 Spotify CLI - Save Albums 🎧📀"));
  console.log(color.gray("--------------------------------------------------"));
  console.log(
    color.bgGreen(color.black(" Welcome to the Bulk Album Saver Application! "))
  );
  console.log(
    color.gray("--------------------------------------------------\n")
  );
  console.log("\n");

  try {
    const res = await refreshTtoken(credentials);

    const sdk = SpotifyApi.withAccessToken("client_id", res);
    setSdk(sdk);

    await saveAlbums(ALBUMS);
    console.log(color.green(`\n✨ Thanks for using this app!`));
  } catch (error) {
    console.log(error);
  }
};

main();

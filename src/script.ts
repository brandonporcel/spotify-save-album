import dotenv from "dotenv";
import axios from "axios";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { parseAlbums, refreshTtoken } from "./utils";
import { setSdk } from "./helpers/sdkManager";
import { handleItems } from "./actions/handle-items";
dotenv.config();

const ALBUMS: string[] = [
    "Las Chicas del Can - Caribe",
    "Timbiriche - Timbiriche VII",
    "Juan D’Arienzo - For export",
    "Perrozompopo - Romper el silencio",
    "Lucila Campos & Óscar Avilés - Valseando Festejos",
    "Charlie Zaa - Sentimientos",
    "Pérez Prado - Prez",
    "Christian Nodal - Me dejé llevar",
    "Roberto Roena y su Apollo Sound - Lucky 7",
    "José José - José José"
];

let accessToken = "";
const credentials = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  refresh_token: process.env.REFRESH_TOKEN,
};

const saveAlbumToFav = async (albumId: string) => {
  try {
    await axios.put(
      "https://api.spotify.com/v1/me/albums",
      { ids: [albumId] },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error: any) {
    console.error("Error saving album to favorites", error.message);
  }
};

const main = async () => {
  if (ALBUMS.length === 0) return;

  const res = await refreshTtoken(credentials);
  accessToken = res.access_token;

  const parsedAlbums = ALBUMS.map(parseAlbums);
  const sdk = SpotifyApi.withAccessToken("client_id", res);
  setSdk(sdk);

  const albumsToSave = await handleItems(parsedAlbums);

  if (albumsToSave.length > 0) {
    await Promise.all(albumsToSave.map((album) => saveAlbumToFav(album.id)));
    console.log(`Has been saved ${albumsToSave.length} albums 🙂`);
  }
};

main();

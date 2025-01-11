import dotenv from "dotenv";
import axios from "axios";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { parseAlbums, refreshTtoken } from "./utils";
import { setSdk } from "./helpers/sdkManager";
import { handleItems } from "./actions/handle-items";
dotenv.config();

const ALBUMS: string[] = [
    "Pablo Milanés - Versos José Martí cantados por Pablo Milanés",
    "Austin TV - La última noche del mundo",
    "La Vela Puerca - De bichos y flores",
    "Ñanda Mañachi - 1",
    "Zoé - Memo Rex Commander y el corazón atómico de la Vía Láctea",
    "Myriam Hernández - Myriam Hernández 2",
    "Libido - Hembra",
    "Systema Solar - Systema Solar",
    "Judith Reyes - Crónica mexicana",
    "Banda Sinaloense Del Recodo - El Sinaloense"
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

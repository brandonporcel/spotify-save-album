import dotenv from "dotenv";
import axios from "axios";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { parseAlbums, refreshTtoken } from "./utils";
import { setSdk } from "./helpers/sdkManager";
import { handleItems } from "./actions/handle-items";
dotenv.config();

const ALBUMS: string[] = [
    "Julian Carrillo, Cuarteto Bredo - Primer Cuarteto Atonal",
    "Cecilia - Cecilia",
    "Leo Brouwer - Música para guitarra",
    "Wos - Caravana",
    "Andrés Huesca y sus Costeños - Recordando",
    "Lola Beltrán - El Palacio de las Bellas Artes abre sus Puertas a La Reyna de la Canción Ranchera",
    "ÌFÉ - IIII+IIII",
    "Broncco - B’Rock",
    "Pacho Galán y su Orquesta - Fiesta en Colombia",
    "Lecuona Cuban Boys & Orquesta Antobal - Rumba And Conga Album, Volume 1"
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

import dotenv from "dotenv";
import axios from "axios";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { parseAlbums, refreshTtoken } from "./utils";
import { setSdk } from "./helpers/sdkManager";
import { handleItems } from "./actions/handle-items";
dotenv.config();

const ALBUMS: string[] = [
    "“La música de Rafael Hernández” Varios Artistas",
    "Rodolfo Aicardi Con Los Hispanos - Qué chévere Volumen 2",
    "Orquesta Filarmónica de la Ciudad de México - 4 compositores mexicanos",
    "Pedro Mo - Ensayos del Camarada Lacrasoft y Algunos Cómplices Metafísicos",
    "Binomio de Oro - Por lo alto",
    "Varios Artistas - Boricua Guerrero: First Combat",
    "Nelson Ned - Si las flores pudieran hablar",
    "Cuarteto Latinoamericano – Alberto Ginestera - The Three String Quartets",
    "Orquesta Casino de la Playa - Memories of Cuba",
    "Frankie Ruiz - Solista pero no solo"
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

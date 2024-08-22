import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import { AlbumResponse } from "./types/definitions";
dotenv.config();

const albums = [
  "Patricia Malanca - Traerán Ríos de Tango las Páginas de un Libro (2021)",
  "Melingo - Tangos bajos (1998)",
  "Melingo - Linyera (2014)",
  "Harold Melvin & The Blue Notes - I Miss You (1972)",
  "Tita Merello - Voz de tango (1967)",
  "Meyhem Lauren - Respect the Fly Shit (2012)",
  "mhtresuno - De la villa pal mundo (2024)",
  "Mir Nicolás & T&K - 29 (2021)",
  "Nico Miseria - Barriobajero navajero (2019)",
  "The Monkees - Headquarters (1967)",
  "The Monkees - Pisces, Aquarius, Capricorn & Jones Ltd. (1967)",
  "Sofía Naara - Las torpezas (2022)",
  "Nafta - NAFTA II (2023)",
  "Rico Nasty - Las ruinas (2022)",
  "Nichess One, 3m5 & Lil Supa - Metal (2023)",
  "Niño Maldito - SA TA NA MA (2023)",
  "Noname - Sundial (2023)",
  "O.L.I.V.I.A - 99% (2020)",
];

const parseAlbums = (album: string) => {
  const yearMatch = album.match(/\((\d{4})\)$/);
  const year = yearMatch ? yearMatch[1] : "Unknown";
  const nameWithoutYear = album.replace(/\s*\(\d{4}\)$/, "").trim();
  const [artist, name] = nameWithoutYear.split(" - ");

  return {
    artist: artist.trim(),
    name: name.trim(),
    year,
  };
};
const parsedAlbums = albums.map(parseAlbums);
console.log(`Saving ${parsedAlbums.length} albums...`);

let accessToken = "";

const credentials = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  refresh_token: process.env.REFRESH_TOKEN,
};

const refreshToken = async () => {
  const { client_id, client_secret } = credentials;
  const refresh_token = credentials.refresh_token!;

  const authOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${client_id}:${client_secret}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  };

  try {
    const response = await fetch(
      "https://accounts.spotify.com/api/token",
      authOptions
    );
    if (!response.ok) {
      throw new Error(`Failed to refresh token. Status: ${response.status}`);
    }
    const data = await response.json();
    accessToken = data.access_token;
  } catch (error: any) {
    console.error("Error refreshing token:", error.message);
  }
};

const searchAlbum = async (albumName: string) => {
  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      params: {
        q: albumName,
        type: "album",
        limit: 1,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.albums.items[0] || null;
  } catch (error: any) {
    console.error(`Error searching for album: ${albumName}`, error.message);
    return null;
  }
};

const logMismatch = (message: string) => {
  const filePath = "check.txt";
  fs.appendFileSync(filePath, message + "\n", "utf8");
};

const handleItems = async (): Promise<AlbumResponse[]> => {
  try {
    const results = await Promise.all(
      parsedAlbums.map(async (album) => {
        const albumData: AlbumResponse = await searchAlbum(
          `${album.artist} ${album.name}`
        );

        const albumDataName = albumData.name.toLocaleLowerCase();
        const albumAskedName = album.name.toLocaleLowerCase();
        const nameMismatch =
          albumDataName !== albumAskedName &&
          !albumDataName.includes(albumAskedName);

        if (nameMismatch) {
          logMismatch(
            `Album mismatch: ${albumData.name} is distinct of what was asked (${album.name})`
          );
          return null;
        }

        return albumData ?? null;
      })
    );

    return results.filter((album) => album !== null);
  } catch (error: any) {
    console.error("Error handling albums", error.message);
    return [];
  }
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
  await refreshToken();
  const albumsToSave = await handleItems();

  if (albumsToSave.length > 0) {
    await Promise.all(albumsToSave.map((album) => saveAlbumToFav(album.id)));
  }
  console.log(`Has been saved ${albumsToSave.length} albums 🙂`);
};

main();
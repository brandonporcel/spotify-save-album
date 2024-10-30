import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import { AlbumResponse, ParsedAlbum } from "./types/definitions";
dotenv.config();

const albums =[
    "Roc Marciano - Reloaded (2012)",
    "Rodolfo Mederos Generación Cero - De todas maneras (1977)",
    "Mir Nicolás - SP.I. (2024)",
    "Nico Miseria - El periplo del héroe (2023)",
    "Nas - Illmatic (1994)",
    "Nas - It Was Written (1996)",
    "The Notorious B.I.G. - Ready to Die (1994)",
    "N.W.A - Straight Outta Compton (1989)",
    "N-Wise Allah - Casino Chips (2017)",
    "Odisea - Odisea (2010)",
    "Orion XL - Kaos & Armonía (2016)",
    "OutKast - Stankonia (2000)",
    "Pescado Rabioso - Pescado 2 (1973)",
    "Pescado Rabioso - Artaud (1973)"
];

const parseAlbums = (album: string): ParsedAlbum => {
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
  console.log(message);
  fs.appendFileSync(filePath, message + "\n", "utf8");

  const outputFilePath = process.env.GITHUB_OUTPUT;
  if (outputFilePath) {
    fs.appendFileSync(outputFilePath, "check_created=true\n");
  } else {
    console.error("GITHUB_OUTPUT no está definido.");
  }
};

const handleItems = async (
  parsedAlbums: ParsedAlbum[]
): Promise<AlbumResponse[]> => {
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
            `Album mismatch: ${albumData.name} is distinct of what was asked, ${album.name}`
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
  if (albums.length === 0) return;
  await refreshToken();

  const parsedAlbums = albums.map(parseAlbums);
  const albumsToSave = await handleItems(parsedAlbums);

  if (albumsToSave.length > 0) {
    await Promise.all(albumsToSave.map((album) => saveAlbumToFav(album.id)));
    console.log(`Has been saved ${albumsToSave.length} albums 🙂`);
  }
};

main();

import * as crypto from "crypto";

export const generateRandomString = (length: number) =>
  crypto.randomBytes(60).toString("hex").slice(0, length);

export const parseAlbums = (album: string) => {
  const yearMatch = album.match(/\((\d{4})\)$/);
  const year = yearMatch ? yearMatch[1] : "";
  const nameWithoutYear = album.replace(/\s*\(\d{4}\)$/, "").trim();
  const [artist, name] = nameWithoutYear.split(" - ");

  return {
    artist: artist.trim(),
    name: name.trim(),
    year,
  };
};

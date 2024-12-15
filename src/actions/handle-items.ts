import color from "picocolors";
import { getSdk } from "../helpers/sdkManager";
import { ParsedAlbum } from "../types/definitions";

export const handleItems = async (parsedAlbums: ParsedAlbum[]) => {
  const sdk = getSdk();

  try {
    const results = await Promise.all(
      parsedAlbums.map(async (album) => {
        const items = await sdk.search(
          `${album.artist} ${album.name}`,
          ["album"],
          undefined,
          1
        );
        if (!items.albums.items.length) return null;

        const albumData = items.albums.items[0];

        const albumDataName = albumData.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const albumAskedName = album.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        const nameMismatch = albumDataName !== albumAskedName;

        if (nameMismatch) {
          console.warn(
            color.yellow(
              `⚠️ Mismatch: '${album.name}' does not match found album '${albumData.name}'`
            )
          );
          return null;
        }

        return albumData;
      })
    );

    return results.filter((album) => album !== null);
  } catch (error: any) {
    console.error(color.red(`❌ Error handling albums: ${error.message}`));
    return [];
  }
};
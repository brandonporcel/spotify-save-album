import color from "picocolors";
import { ALBUMS } from "..";
import { getSdk } from "../helpers/sdkManager";
import { ParsedAlbum } from "../types/definitions";
import { parseAlbums } from "../utils";

const handleItems = async (parsedAlbums: ParsedAlbum[]) => {
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

        if (
          albumDataName !== albumAskedName &&
          !albumDataName.includes(albumAskedName)
        ) {
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

const saveAlbums = async () => {
  const sdk = getSdk();
  try {
    const parsedAlbums = ALBUMS.map(parseAlbums);
    const albumsToSave = await handleItems(parsedAlbums);
    if (albumsToSave.length > 0) {
      await Promise.all(
        albumsToSave.map(async (album) =>
          sdk.makeRequest("PUT", "me/albums", {
            ids: [album.id],
          })
        )
      );
      console.log(
        color.cyan(`🎉 ${albumsToSave.length} album(s) successfully saved!`)
      );
    } else {
      console.log(color.yellow("⚠️ No albums matched the search criteria."));
    }
    console.log(color.green(`\n✨ Thanks for using this app!`));
    process.exit(0);
  } catch (error: any) {
    console.error(color.red(`❌ Error during callback: ${error.message}`));
  }
};

export default saveAlbums;

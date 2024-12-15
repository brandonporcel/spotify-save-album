import color from "picocolors";
import { ALBUMS } from "..";
import { getSdk } from "../helpers/sdkManager";
import { parseAlbums } from "../utils";
import { handleItems } from "./handle-items";

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

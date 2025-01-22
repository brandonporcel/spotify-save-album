import color from "picocolors";
import { getSdk } from "../helpers/sdkManager";
import { parseAlbums } from "../utils";
import { handleItems } from "./handle-items";

const saveAlbums = async (ALBUMS: string[]) => {
  const sdk = getSdk();

  try {
    const parsedAlbums = ALBUMS.map(parseAlbums);
    const { toSave, unFoundAlbums } = await handleItems(parsedAlbums);
    if (toSave.length > 0) {
      await Promise.all(
        toSave.map(async (album) =>
          sdk.makeRequest("PUT", "me/albums", {
            ids: [album.id],
          })
        )
      );
      console.log(
        color.cyan(`🎉 ${toSave.length} album(s) successfully saved!`)
      );
    } else {
      console.log(color.yellow("⚠️ No albums matched the search criteria."));
    }
    return { toSave, unFoundAlbums };
  } catch (error: any) {
    console.error(color.red(`❌ Error during callback: ${error.message}`));
    throw new Error("Error during callback");
  }
};

export default saveAlbums;

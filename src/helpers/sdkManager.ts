import { SpotifyApi } from "@spotify/web-api-ts-sdk";

let sdkInstance: SpotifyApi | null = null;

export const setSdk = (sdk: SpotifyApi) => {
  sdkInstance = sdk;
};

export const getSdk = (): SpotifyApi => {
  if (!sdkInstance) {
    throw new Error("SDK not initialized. Call setSdk() first.");
  }
  return sdkInstance;
};

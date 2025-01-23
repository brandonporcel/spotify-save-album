import { Request } from "express";
import color from "picocolors";
import axios, { AxiosRequestConfig } from "axios";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import dotenv from "dotenv";
import { setSdk } from "../helpers/sdkManager";
dotenv.config();

const { PORT = 8888 } = process.env;
const redirect_uri = `http://localhost:${PORT}/callback`;

export const authorizeUser = async (code: string) => {
  const authOptions: AxiosRequestConfig = {
    url: "https://accounts.spotify.com/api/token",
    method: "post",
    data: new URLSearchParams({
      code: code,
      redirect_uri,
      grant_type: "authorization_code",
    }).toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  };

  const { data } = await axios(authOptions);
  return data;
};

export const authCallback = async (
  req: Request
): Promise<{ access_token: string }> => {
  const code = req.query.code as string;
  const state = req.query.state as string;

  if (!state) {
    throw new Error("state_mismatch");
  }
  if (!code) {
    throw new Error("code_mismatch");
  }

  try {
    const authData = await authorizeUser(code);
    const access_token = authData.access_token;

    const sdk = SpotifyApi.withAccessToken("client_id", authData);
    setSdk(sdk);

    console.log(color.green("✅ Successfully authenticated with Spotify API."));
    return { access_token };
  } catch (error: any) {
    console.error(color.red(`❌ Error during callback: ${error.message}`));
    throw new Error("Error during authentication callback");
  }
};

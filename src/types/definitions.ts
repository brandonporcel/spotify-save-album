export interface AlbumResponse {
  album_type: string;
  artists: any[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
  images?: any[];
}

export interface ExternalUrls {
  spotify: string;
}

export interface ParsedAlbum {
  name: string;
  artist: string;
  year: string;
}

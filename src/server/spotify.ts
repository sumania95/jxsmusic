import SpotifyWebApi from "spotify-web-api-node";

export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_API_KEY,
  clientSecret: process.env.NEXT_SPOTIFY_SECRET_API_KEY,
});


// const query = "Imagine Dragons Believer"; // search term
// const limit = 10; // number of results

// const result = await spotifyApi.searchTracks(query, { limit });

// console.log(result.body.tracks?.items?.map(track => ({
//   name: track.name,
//   artists: track.artists.map(a => a.name).join(", "),
//   spotifyId: track.id,
//   previewUrl: track.preview_url,
//   spotifyUrl: track.external_urls.spotify,
// })) ?? []);
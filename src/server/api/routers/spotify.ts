import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import SpotifyWebApi from 'spotify-web-api-node';
import { env } from '@/env';


export const spotifyRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      const spotifyApi = new SpotifyWebApi({
        clientId: env.NEXT_PUBLIC_SPOTIFY_CLIENT_API_KEY,
        clientSecret: env.NEXT_SPOTIFY_SECRET_API_KEY,
      });

      // get access token
      const data = await spotifyApi.clientCredentialsGrant();
      spotifyApi.setAccessToken(data.body.access_token);

      // search tracks
      const response = await spotifyApi.searchTracks(input.query, { limit: 10 });

      return response.body.tracks?.items.map((track) => ({
        name: track.name,
        artists: track.artists.map((a) => a.name).join(', '),
        spotifyId: track.id,
        previewUrl: track.preview_url ?? undefined,
        spotifyUrl: track.external_urls.spotify ?? undefined,
      })) ?? [];
    }),
});

import { formatTrackTitle } from "@/lib/utils";

type Props = {
    id: string;
    user: {
        id: string;
        image: string | null;
    };
    price: number;
    title: string | null;
    artist: string | null;
    in_key: string | null;
    filetype: string | null;
    preview_key: string | null;
    bpm_start: number;
    bpm_end: number;
    release_year: number;
    duration: number;
    is_explicit: boolean;
    releaseAt: Date;
    genre_track: {
        genre: {
            name: string;
        };
    }[];
}


export const buildPlaylist = (tracks: Props[]) =>
tracks.map(({ id, title, artist, is_explicit, user, filetype,preview_key }, idx) => {
    const isVideo = filetype?.includes("video")
    const ext = isVideo ? "mp4" : "mp3"
    return {
      index: idx,
      id,
      title: formatTrackTitle(title, is_explicit),
      artist: String(artist),
      key: String(preview_key),
      isFull: false,
      isExclusive: false,
      bucketName: "jxs-music",
      islink: String(user.image),
    }
  })

type PropsAlbum = {
    track: {
        id: string;
        user: {
            id: string;
            image: string | null;
        };
        price: number;
        title: string | null;
        artist: string | null;
        in_key: string | null;
        filetype: string | null;
        bpm_start: number;
        bpm_end: number;
        release_year: number;
        duration: number;
        is_opm: boolean;
        is_explicit: boolean;
        is_exclusive: boolean;
        releaseAt: Date;
        genre_track: {
            genre: {
                name: string;
            };
        }[];
    };
}
export const buildAlbumPlaylist = (
  trackAlbum: PropsAlbum[]
) => {
  return trackAlbum.map(({ track }, idx) => {
    const isVideo = track.filetype?.includes("video")
    const ext = isVideo ? "mp4" : "mp3"

    return {
      index: idx,
      id: track.id,
      title: formatTrackTitle(track.title, track.is_explicit),
      artist: String(track.artist ?? ""),
      key: isVideo ? `file/${track.id}.${ext}` : `${track.id}.${ext}`,
      isFull: false,
      isExclusive: false,
      bucketName: "jxs-music",
      islink: String(track.user?.image ?? ""),
    }
  })
}


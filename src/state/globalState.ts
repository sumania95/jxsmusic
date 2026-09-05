import { atom } from 'jotai'

import WaveSurfer from 'wavesurfer.js'; // Ensure proper import

// Atom to store the Wavesurfer instance (null initially)
export const wavesurferAtom = atom<WaveSurfer | null>(null);
// Atom for playback state
export const isPlayingAtom = atom(false);

// Atom to track readiness
export const isReadyAtom = atom(false);
export const autoplayAtom = atom(false);

export const playerState = atom({
    id:'',
    source:'',
    playing: false,
    controls: false,
    volume: 1,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    seek: 0,
    progress: 0,
    durationv2:0,
    next:false
})

interface DataPlaylist {
    id: string;
    index: number;
    title:string;
    artist:string;
    key:string;
    isFull:boolean;
    isExclusive?:boolean;
    islink?:string;
    bucketName?:string;
}

export const sortData = atom({
    name:'Recent',
    tableName:'releaseAt',
    order:'desc'
})
export const playlist = atom<DataPlaylist[]>([])

export const changePasswordState = atom(false)
export const shrinkMode = atom(true)
export const filterSearchMode = atom(false)

export const filterState = atom({
    selectionFilter:'all',
    search:'',
    key:[] as string[],
    keyTemp:[] as string[],
    genre:[] as string[],
    bpmStart:0,
    bpmEnd:200,
    yearStart:1950,
    yearEnd:new Date().getFullYear(),
    currentButton:1
})

export const filterEditorState = atom({
    search:'',
    key:[] as string[],
    genre:[] as string[],
    bpmStart:0,
    bpmEnd:200,
    yearStart:1950,
    yearEnd:new Date().getFullYear(),
    currentButton:1
})

export const downloadingState = atom({
    status:false,
    id:''
})




// NEW IMPLEMENTATION

export const defaultPageLimit = atom(20);


export const loopLengthAtom = atom(90);

export const regionTimeAtom = atom<{ start: number; end: number }>({
  start: 0,
  end: 90,
});



export const idAdminTracks = atom("");

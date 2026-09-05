import decodeAudio from 'audio-decode';
import Meyda from 'meyda';

// Full Camelot mapping
const camelotMajor: Record<string, string> = {
  "C": "8B", "C#": "3B", "D": "10B", "D#": "5B", "E": "12B",
  "F": "7B", "F#": "2B", "G": "9B", "G#": "4B", "A": "11B",
  "A#": "6B", "B": "1B"
};

const camelotMinor: Record<string, string> = {
  "C": "5A", "C#": "12A", "D": "7A", "D#": "2A", "E": "9A",
  "F": "4A", "F#": "11A", "G": "6A", "G#": "1A", "A": "8A",
  "A#": "3A", "B": "10A"
};

// ------------------------------------------------------
// ⭐ FIXED: Type-safe Chroma Vector (12 required numbers)
// ------------------------------------------------------
type ChromaVector = [
  number, number, number, number, number, number,
  number, number, number, number, number, number
];

export async function analyzeKeyFromUrl(url: string, isMinor = false) {
  // 1. Fetch audio from URL
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  // 2. Decode audio
  const audioBuffer = await decodeAudio(Buffer.from(arrayBuffer));

  // 3. Extract chroma features
  const channelData = audioBuffer.getChannelData(0);
  const hopSize = 512;

  // NEW: typed array (fixes TypeScript errors)
  const chromaArray: ChromaVector[] = [];

  for (let i = 0; i + hopSize <= channelData.length; i += hopSize) {
    const frame = channelData.slice(i, i + hopSize);

    if (frame.length !== hopSize) continue;

    const features = Meyda.extract("chroma", frame);

    // Fully type-safe
    if (features?.chroma && features?.chroma?.length === 12) {
      chromaArray.push(features.chroma as ChromaVector);
    }
  }

  // 4. Sum chroma over time
  const sumChroma = new Array(12).fill(0);

  for (const c of chromaArray) {
    for (let j = 0; j < 12; j++) {
      sumChroma[j] += c[j]; // No TS error now
    }
  }

  // 5. Find highest energy note → root note
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const maxIndex = sumChroma.indexOf(Math.max(...sumChroma as number[]));

  const rootNote = notes[maxIndex]; // always safe (0–11 index)

  // 6. Map to Camelot key
  const camelotKey = isMinor
    ? camelotMinor[String(rootNote)]
    : camelotMajor[String(rootNote)];

  return {
    note: rootNote,
    camelotKey
  };
}

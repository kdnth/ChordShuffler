import type { Chord } from './chords';
import { CHORD_STEPS_MAP, Note } from './chords';

export const E_PIANO_INSTRUMENT = 'CP80';

function formatMidiNote(note: Note, octave: number = 4) {
  return `${note}${octave}`;
}

export function getChordMidiNoteArray(chord: Chord, noteArr: Note[]) {
  const rootIndex: number = noteArr.indexOf(chord.note);

  return [
    formatMidiNote(noteArr[rootIndex]!),
    formatMidiNote(noteArr[(rootIndex + CHORD_STEPS_MAP[chord.quality].third) % noteArr.length]!),
    formatMidiNote(noteArr[(rootIndex + CHORD_STEPS_MAP[chord.quality].fifth) % noteArr.length]!),
    formatMidiNote(noteArr[(rootIndex + CHORD_STEPS_MAP[chord.quality].seventh) % noteArr.length]!)
  ];
}

export function beatsToSeconds(beats: number, bpm: number) {
  return (60 / bpm) * beats;
}

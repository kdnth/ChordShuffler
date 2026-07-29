export enum Note {
  A = 'A',
  A_FLAT = 'Ab',
  A_SHARP = 'A#',
  B = 'B',
  B_FLAT = 'Bb',
  C = 'C',
  C_SHARP = 'C#',
  D = 'D',
  D_FLAT = 'Db',
  D_SHARP = 'D#',
  E = 'E',
  E_FLAT = 'Eb',
  F = 'F',
  F_SHARP = 'F#',
  G = 'G',
  G_FLAT = 'Gb',
  G_SHARP = 'G#'
}

export enum Quality {
  MAJ_7 = 'maj7',
  MIN_7 = 'min7',
  DOM_7 = '7',
  HALF_DIM = 'ø',
  DIM_7 = 'º'
}

export interface Chord {
  note: Note;
  quality: Quality;
}

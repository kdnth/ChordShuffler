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
  HALF_DIM = 'ø7',
  DIM_7 = 'º7'
}

export interface Chord {
  note: Note;
  quality: Quality;
}

export interface Key {
  tonic: Note;
  type: ScaleType;
  useFlats: boolean;
}

class InvalidKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidKeyError';
  }
}

export enum ScaleType {
  MAJOR = 'major',
  NATURAL_MINOR = 'minor'
} // all other scales out of scope right now

export interface ScaleDegreeQualities {
  root: Quality;
  second: Quality;
  third: Quality;
  fourth: Quality;
  fifth: Quality;
  sixth: Quality;
  seventh: Quality;
}

export interface ScaleDegreeSteps {
  second: number;
  third: number;
  fourth: number;
  fifth: number;
  sixth: number;
  seventh: number;
}

export const notesWithSharps: Note[] = [
  Note.A,
  Note.A_SHARP,
  Note.B,
  Note.C,
  Note.C_SHARP,
  Note.D,
  Note.D_SHARP,
  Note.E,
  Note.F,
  Note.F_SHARP,
  Note.G,
  Note.G_SHARP
];

export const notesWithFlats: Note[] = [
  Note.A,
  Note.B_FLAT,
  Note.B,
  Note.C,
  Note.D_FLAT,
  Note.D,
  Note.E_FLAT,
  Note.E,
  Note.F,
  Note.G_FLAT,
  Note.G,
  Note.A_FLAT
];

const majorScaleQualities: ScaleDegreeQualities = {
  root: Quality.MAJ_7,
  second: Quality.MIN_7,
  third: Quality.MIN_7,
  fourth: Quality.MAJ_7,
  fifth: Quality.DOM_7,
  sixth: Quality.MIN_7,
  seventh: Quality.HALF_DIM
};

const naturalMinorScaleQualities: ScaleDegreeQualities = {
  root: Quality.MIN_7,
  second: Quality.HALF_DIM,
  third: Quality.MAJ_7,
  fourth: Quality.MIN_7,
  fifth: Quality.MIN_7,
  sixth: Quality.MAJ_7,
  seventh: Quality.DOM_7
};

const majorScaleSteps: ScaleDegreeSteps = {
  second: 2,
  third: 4,
  fourth: 5,
  fifth: 7,
  sixth: 9,
  seventh: 11
};

const naturalMinorScaleSteps: ScaleDegreeSteps = {
  second: 2,
  third: 3,
  fourth: 5,
  fifth: 7,
  sixth: 8,
  seventh: 10
};

const SCALE_MAP: Record<ScaleType, { steps: ScaleDegreeSteps; qualities: ScaleDegreeQualities }> = {
  [ScaleType.MAJOR]: {
    steps: majorScaleSteps,
    qualities: majorScaleQualities
  },
  [ScaleType.NATURAL_MINOR]: {
    steps: naturalMinorScaleSteps,
    qualities: naturalMinorScaleQualities
  }
};

export const validKeys: Key[] = [
  { tonic: Note.C, type: ScaleType.MAJOR, useFlats: false },
  { tonic: Note.G, type: ScaleType.MAJOR, useFlats: false },
  { tonic: Note.D, type: ScaleType.MAJOR, useFlats: false },
  { tonic: Note.A, type: ScaleType.MAJOR, useFlats: false },
  { tonic: Note.E, type: ScaleType.MAJOR, useFlats: false },
  { tonic: Note.B, type: ScaleType.MAJOR, useFlats: false },
  { tonic: Note.F_SHARP, type: ScaleType.MAJOR, useFlats: false },
  { tonic: Note.G_FLAT, type: ScaleType.MAJOR, useFlats: true },
  { tonic: Note.C_SHARP, type: ScaleType.MAJOR, useFlats: false },
  { tonic: Note.D_FLAT, type: ScaleType.MAJOR, useFlats: true },
  { tonic: Note.A_FLAT, type: ScaleType.MAJOR, useFlats: true },
  { tonic: Note.E_FLAT, type: ScaleType.MAJOR, useFlats: true },
  { tonic: Note.B_FLAT, type: ScaleType.MAJOR, useFlats: true },
  { tonic: Note.F, type: ScaleType.MAJOR, useFlats: true },

  { tonic: Note.A, type: ScaleType.NATURAL_MINOR, useFlats: false },
  { tonic: Note.E, type: ScaleType.NATURAL_MINOR, useFlats: false },
  { tonic: Note.B, type: ScaleType.NATURAL_MINOR, useFlats: false },
  { tonic: Note.F_SHARP, type: ScaleType.NATURAL_MINOR, useFlats: false },
  { tonic: Note.C_SHARP, type: ScaleType.NATURAL_MINOR, useFlats: false },
  { tonic: Note.G_SHARP, type: ScaleType.NATURAL_MINOR, useFlats: false },
  { tonic: Note.D_SHARP, type: ScaleType.NATURAL_MINOR, useFlats: false },
  { tonic: Note.E_FLAT, type: ScaleType.NATURAL_MINOR, useFlats: true },
  { tonic: Note.A_SHARP, type: ScaleType.NATURAL_MINOR, useFlats: false },
  { tonic: Note.B_FLAT, type: ScaleType.NATURAL_MINOR, useFlats: true },
  { tonic: Note.F, type: ScaleType.NATURAL_MINOR, useFlats: true },
  { tonic: Note.C, type: ScaleType.NATURAL_MINOR, useFlats: true },
  { tonic: Note.G, type: ScaleType.NATURAL_MINOR, useFlats: true },
  { tonic: Note.D, type: ScaleType.NATURAL_MINOR, useFlats: true }
];

export const allNotes = Object.values(Note); // TODO: use this in HomeView

export function createChord(note: Note, quality: Quality) {
  return {
    note: note,
    quality: quality
  };
} // TODO: use this in HomeView

export function findValidKey(tonic: Note, scaleType: ScaleType) {
  /* finds valid key in validKeys matching provided tonic and scaleType. Throws InvalidKeyError if key is invalid*/
  const key = validKeys.find((key) => key.tonic === tonic && key.type === scaleType);
  if (!key) {
    throw new InvalidKeyError(`${tonic} ${scaleType} is not a valid key`);
  }

  return key;
}

export function computeKeyArray(key: Key) {
  /* Computes Chord array of diatonic chords according to the provided Key.*/

  const allNotes: Note[] = key?.useFlats ? notesWithFlats : notesWithSharps;
  const tonicIndex = allNotes.indexOf(key.tonic);
  return [
    createChord(allNotes[tonicIndex]!, SCALE_MAP[key.type].qualities.root),
    createChord(
      allNotes[(tonicIndex + SCALE_MAP[key.type].steps.second) % allNotes.length]!,
      SCALE_MAP[key.type].qualities.second
    ),
    createChord(
      allNotes[(tonicIndex + SCALE_MAP[key.type].steps.third) % allNotes.length]!,
      SCALE_MAP[key.type].qualities.third
    ),
    createChord(
      allNotes[(tonicIndex + SCALE_MAP[key.type].steps.fourth) % allNotes.length]!,
      SCALE_MAP[key.type].qualities.fourth
    ),
    createChord(
      allNotes[(tonicIndex + SCALE_MAP[key.type].steps.fifth) % allNotes.length]!,
      SCALE_MAP[key.type].qualities.fifth
    ),
    createChord(
      allNotes[(tonicIndex + SCALE_MAP[key.type].steps.sixth) % allNotes.length]!,
      SCALE_MAP[key.type].qualities.sixth
    ),
    createChord(
      allNotes[(tonicIndex + SCALE_MAP[key.type].steps.seventh) % allNotes.length]!,
      SCALE_MAP[key.type].qualities.seventh
    )
  ];
}

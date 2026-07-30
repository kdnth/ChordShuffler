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

export interface Scale {
  tonic: Note;
  type: ScaleType;
}

export enum ScaleType {
  MAJOR = 'major',
  NATURAL_MINOR = 'natural minor'
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

const notesWithSharps: Note[] = [
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

const notesWithFlats: Note[] = [
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

const VALID_KEY_MAP = {
  [ScaleType.MAJOR]: {
    [Note.C]: notesWithSharps,
    [Note.G]: notesWithSharps,
    [Note.D]: notesWithSharps,
    [Note.A]: notesWithSharps,
    [Note.E]: notesWithSharps,
    [Note.B]: notesWithSharps,
    [Note.F_SHARP]: notesWithSharps,
    [Note.G_FLAT]: notesWithFlats,
    [Note.C_SHARP]: notesWithSharps,
    [Note.D_FLAT]: notesWithFlats,
    [Note.A_FLAT]: notesWithFlats,
    [Note.E_FLAT]: notesWithFlats,
    [Note.B_FLAT]: notesWithFlats,
    [Note.F]: notesWithFlats
  },
  [ScaleType.NATURAL_MINOR]: {
    [Note.A]: notesWithSharps,
    [Note.E]: notesWithSharps,
    [Note.B]: notesWithSharps,
    [Note.F_SHARP]: notesWithSharps,
    [Note.C_SHARP]: notesWithSharps,
    [Note.G_SHARP]: notesWithSharps,
    [Note.D_SHARP]: notesWithSharps,
    [Note.E_FLAT]: notesWithFlats,
    [Note.A_SHARP]: notesWithSharps,
    [Note.B_FLAT]: notesWithFlats,
    [Note.F]: notesWithFlats,
    [Note.C]: notesWithFlats,
    [Note.G]: notesWithFlats,
    [Note.D]: notesWithFlats
  }
};

export const allNotes = Object.values(Note); // TODO: use this in HomeView

export function createChord(note: Note, quality: Quality) {
  return {
    note: note,
    quality: quality
  };
} // TODO: use this in HomeView

export function computeKeyArray(tonic: Note, scaleType: ScaleType) {
  /* Computes Chord array of diatonic chords according to the provided tonic and scale type*/
  const allNotes: Note[] =
    VALID_KEY_MAP[scaleType][tonic as keyof (typeof VALID_KEY_MAP)[ScaleType]];
  const tonicIndex = allNotes.indexOf(tonic);
  return [
    createChord(allNotes[tonicIndex]!, SCALE_MAP[scaleType].qualities.root),
    createChord(
      allNotes[(tonicIndex + SCALE_MAP[scaleType].steps.second) % allNotes.length]!,
      SCALE_MAP[scaleType].qualities.second
    ),
    createChord(
      allNotes[(tonicIndex + SCALE_MAP[scaleType].steps.third) % allNotes.length]!,
      SCALE_MAP[scaleType].qualities.third
    ),
    createChord(
      allNotes[(tonicIndex + SCALE_MAP[scaleType].steps.fourth) % allNotes.length]!,
      SCALE_MAP[scaleType].qualities.fourth
    ),
    createChord(
      allNotes[(tonicIndex + SCALE_MAP[scaleType].steps.fifth) % allNotes.length]!,
      SCALE_MAP[scaleType].qualities.fifth
    ),
    createChord(
      allNotes[(tonicIndex + SCALE_MAP[scaleType].steps.sixth) % allNotes.length]!,
      SCALE_MAP[scaleType].qualities.sixth
    ),
    createChord(
      allNotes[(tonicIndex + SCALE_MAP[scaleType].steps.seventh) % allNotes.length]!,
      SCALE_MAP[scaleType].qualities.seventh
    )
  ];
}

console.log(computeKeyArray(Note.C, ScaleType.MAJOR));

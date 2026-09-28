// Shared content for the poetry games. Every line here is from a poem that is
// in the public domain, so it is safe to quote on the site.

// ---- Complete the line -----------------------------------------------------

export type LineEntry = {
  /** The line with the missing word replaced by "___". */
  prompt: string;
  answer: string;
  options: string[];
  source: string;
};

export const LINES: LineEntry[] = [
  {
    prompt: "I wandered lonely as a ___",
    answer: "cloud",
    options: ["cloud", "crowd", "shroud", "flower"],
    source: "William Wordsworth, 1807",
  },
  {
    prompt: "Shall I compare thee to a summer's ___?",
    answer: "day",
    options: ["dream", "day", "tide", "shade"],
    source: "William Shakespeare, Sonnet 18",
  },
  {
    prompt: "Once upon a midnight ___, while I pondered, weak and weary",
    answer: "dreary",
    options: ["weary", "dreary", "stormy", "stealthy"],
    source: "Edgar Allan Poe, The Raven",
  },
  {
    prompt: "Because I could not stop for ___ — He kindly stopped for me",
    answer: "Death",
    options: ["Spring", "Sorrow", "Death", "Time"],
    source: "Emily Dickinson, 1890",
  },
  {
    prompt: "A thing of beauty is a ___ for ever",
    answer: "joy",
    options: ["song", "joy", "flame", "vow"],
    source: "John Keats, Endymion",
  },
  {
    prompt: "Tyger Tyger, burning ___, burning in the forests of the night",
    answer: "bright",
    options: ["white", "light", "bright", "night"],
    source: "William Blake, Songs of Experience",
  },
  {
    prompt: "To see a World in a Grain of ___",
    answer: "Sand",
    options: ["Seed", "Sand", "Star", "Stone"],
    source: "William Blake, Auguries of Innocence",
  },
  {
    prompt: "Two roads diverged in a ___, and I — I took the one less traveled by",
    answer: "wood",
    options: ["wood", "dream", "field", "storm"],
    source: "Robert Frost, The Road Not Taken",
  },
  {
    prompt: "This is the way the world ends, not with a ___ but a whimper",
    answer: "bang",
    options: ["bang", "bell", "cry", "roar"],
    source: "T. S. Eliot, The Hollow Men",
  },
  {
    prompt: "Hope is the thing with ___ that perches in the soul",
    answer: "feathers",
    options: ["wings", "feathers", "whispers", "sunbeams"],
    source: "Emily Dickinson, 1861",
  },
  {
    prompt: "I am large, I contain ___",
    answer: "multitudes",
    options: ["verses", "countries", "multitudes", "secrets"],
    source: "Walt Whitman, Song of Myself",
  },
  {
    prompt: "How do I love thee? Let me ___ the ways",
    answer: "count",
    options: ["count", "number", "relate", "treasure"],
    source: "Elizabeth Barrett Browning, Sonnet 43",
  },
  {
    prompt: "We are such stuff as ___ are made on, and our little life is rounded with a sleep",
    answer: "dreams",
    options: ["shadows", "dreams", "stories", "silence"],
    source: "William Shakespeare, The Tempest",
  },
  {
    prompt: "The old ___ changeth, yielding place to new",
    answer: "order",
    options: ["order", "king", "song", "world"],
    source: "Alfred, Lord Tennyson, Idylls of the King",
  },
];

// ---- Rhyme match -----------------------------------------------------------

/** Pairs of words that rhyme; each round draws six of these. */
export const RHYMES: [string, string][] = [
  ["light", "night"],
  ["breeze", "trees"],
  ["heart", "apart"],
  ["soul", "whole"],
  ["song", "along"],
  ["dream", "seem"],
  ["glow", "snow"],
  ["rose", "knows"],
  ["rain", "pain"],
  ["wings", "things"],
  ["flame", "shame"],
  ["shore", "explore"],
];

// ---- Verse unscramble ------------------------------------------------------

/** Lines whose words are shuffled and put back in order by the player. */
export const VERSES: { words: string[]; source: string }[] = [
  { words: "I wandered lonely as a cloud".split(" "), source: "William Wordsworth" },
  { words: "Hope is the thing with feathers".split(" "), source: "Emily Dickinson" },
  { words: "A thing of beauty is a joy for ever".split(" "), source: "John Keats" },
  { words: "Because I could not stop for Death".split(" "), source: "Emily Dickinson" },
  { words: "Tyger Tyger burning bright".split(" "), source: "William Blake" },
  { words: "Once upon a midnight dreary".split(" "), source: "Edgar Allan Poe" },
  {
    words: "We are such stuff as dreams are made on".split(" "),
    source: "William Shakespeare",
  },
  { words: "Two roads diverged in a yellow wood".split(" "), source: "Robert Frost" },
  { words: "Not with a bang but a whimper".split(" "), source: "T. S. Eliot" },
  {
    words: "Shall I compare thee to a summer's day".split(" "),
    source: "William Shakespeare",
  },
];

// ---- helpers ---------------------------------------------------------------

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = swap;
  }
  return copy;
}

export function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

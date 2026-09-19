export type WordEntry = { word: string; hint: string };

export const WORDS: WordEntry[] = [
  { word: "SONNET", hint: "A fourteen-line poem, often about love." },
  { word: "STANZA", hint: "A grouped set of lines in a poem." },
  { word: "METAPHOR", hint: "Calling one thing another without 'like' or 'as'." },
  { word: "SIMILE", hint: "A comparison using 'like' or 'as'." },
  { word: "HAIKU", hint: "Three lines: five, seven, five syllables." },
  { word: "ELEGY", hint: "A mournful poem for someone lost." },
  { word: "ODE", hint: "A lyrical poem of praise." },
  { word: "BALLAD", hint: "A narrative poem, often sung." },
  { word: "COUPLET", hint: "Two lines that rhyme together." },
  { word: "RHYME", hint: "Matching sounds at the ends of lines." },
  { word: "METER", hint: "The rhythmic structure of a line." },
  { word: "IAMB", hint: "An unstressed then stressed syllable: da-DUM." },
  { word: "ALLITERATION", hint: "Repeating the same starting consonant sound." },
  { word: "ASSONANCE", hint: "Repeating vowel sounds within words." },
  { word: "ENJAMBMENT", hint: "A sentence running past the line break." },
  { word: "IMAGERY", hint: "Language that appeals to the senses." },
  { word: "VILLANELLE", hint: "Nineteen lines with two repeating refrains." },
  { word: "SESTINA", hint: "Six stanzas rotating six end words." },
  { word: "LIMERICK", hint: "Five humorous lines with AABBA rhyme." },
  { word: "REFRAIN", hint: "A line repeated throughout a poem." },
  { word: "CAESURA", hint: "A deliberate pause in the middle of a line." },
  { word: "PERSONIFICATION", hint: "Giving human traits to non-human things." },
  { word: "HYPERBOLE", hint: "Deliberate exaggeration for effect." },
  { word: "ONOMATOPOEIA", hint: "A word that sounds like what it means." },
  { word: "SYMBOL", hint: "Something that stands for a larger idea." },
  { word: "VERSE", hint: "Writing arranged in lines; poetry itself." },
  { word: "MUSE", hint: "The source of a poet's inspiration." },
  { word: "LYRIC", hint: "A short, emotional, first-person poem." },
  { word: "EPIC", hint: "A long heroic narrative poem." },
  { word: "QUATRAIN", hint: "A four-line stanza." },
  { word: "PROSODY", hint: "The study of rhythm and sound in verse." },
  { word: "TERCET", hint: "A three-line stanza." },
  { word: "SYLLABLE", hint: "A single unit of spoken sound." },
  { word: "PENTAMETER", hint: "A line with five metrical feet." },
  { word: "ANAPHORA", hint: "Repeating a word at the start of lines." },
  { word: "GHAZAL", hint: "Couplets sharing a refrain, rooted in Urdu and Persian." },
  { word: "INK", hint: "What the poet's pen runs on." },
  { word: "QUILL", hint: "An old feather pen." },
  { word: "PROSE", hint: "Ordinary writing, not in verse." },
  { word: "MELANCHOLY", hint: "A pensive sadness poets adore." },
];

export function pickWord(exclude?: string): WordEntry {
  const pool = WORDS.filter((w) => w.word !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

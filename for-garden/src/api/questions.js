// Hebrew learning dataset: 60 questions across levels

const animals = [
  { letter: 'א', word: 'אריה', emoji: '🦁' },
  { letter: 'ב', word: 'ברווז', emoji: '🦆' },
  { letter: 'ג', word: 'גמל', emoji: '🐪' },
  { letter: 'ד', word: 'דוב', emoji: '🐻' },
  { letter: 'ה', word: 'היפופוטם', emoji: '🦛' },
  { letter: 'ז', word: 'זברה', emoji: '🦓' },
  { letter: 'ח', word: 'חתול', emoji: '🐱' },
  { letter: 'ט', word: 'טווס', emoji: '🦚' },
  { letter: 'י', word: 'יעל', emoji: '🐐' },
  { letter: 'כ', word: 'כלב', emoji: '🐶' },
  { letter: 'ל', word: 'לוויתן', emoji: '🐋' },
  { letter: 'מ', word: 'מכרסם', emoji: '🐭' },
  { letter: 'נ', word: 'נמר', emoji: '🐯' },
  { letter: 'ס', word: 'סוס', emoji: '🐴' },
  { letter: 'פ', word: 'פרפר', emoji: '🦋' },
  { letter: 'צ', word: 'צב', emoji: '🐢' },
  { letter: 'ק', word: 'קוף', emoji: '🐒' },
  { letter: 'ר', word: 'רץ? (רקון)', emoji: '🦝' },
  { letter: 'ש', word: 'שועל', emoji: '🦊' },
  { letter: 'ת', word: 'תנין', emoji: '🐊' },
]

function pickDistractors(correctIndex, pool, count) {
  const result = []
  const used = new Set([correctIndex])
  while (result.length < count) {
    const idx = Math.floor(Math.random() * pool.length)
    if (!used.has(idx)) {
      used.add(idx)
      result.push(pool[idx])
    }
  }
  return result
}

function buildEasyQuestions() {
  // Type: identify-animal-by-letter
  return animals.map((a, i) => {
    const distractors = pickDistractors(i, animals, 2)
    const options = [a, ...distractors]
      .sort(() => Math.random() - 0.5)
      .map((x) => ({ image: x.emoji, label: x.word, letter: x.letter }))
    const correctIndex = options.findIndex((o) => o.letter === a.letter)
    return {
      id: `easy-${i}`,
      level: 'easy',
      type: 'identify-animal-by-letter',
      prompt: `איזו חיה מתחילה באות ${a.letter}?`,
      letter: a.letter,
      options,
      correctIndex,
    }
  })
}

const pictureWords = [
  { word: 'כלב', emoji: '🐶', missing: 'ב', choices: ['ב', 'ד', 'כ'] },
  { word: 'חתול', emoji: '🐱', missing: 'ח', choices: ['ח', 'כ', 'ת'] },
  { word: 'דג', emoji: '🐟', missing: 'ג', choices: ['ג', 'ק', 'צ'] },
  { word: 'סוס', emoji: '🐴', missing: 'ס', choices: ['ס', 'ש', 'צ'] },
  { word: 'נמר', emoji: '🐯', missing: 'נ', choices: ['נ', 'מ', 'ר'] },
  { word: 'צבה', emoji: '🐢', missing: 'צ', choices: ['צ', 'ס', 'ץ'] },
  { word: 'דובה', emoji: '🐻', missing: 'ד', choices: ['ד', 'ב', 'ת'] },
  { word: 'לוויתן', emoji: '🐋', missing: 'ל', choices: ['ל', 'ו', 'ת'] },
  { word: 'גמל', emoji: '🐪', missing: 'מ', choices: ['מ', 'ל', 'ג'] },
  { word: 'זברה', emoji: '🦓', missing: 'ז', choices: ['ז', 'צ', 'ס'] },
  { word: 'פרפר', emoji: '🦋', missing: 'פ', choices: ['פ', 'ב', 'ר'] },
  { word: 'טווס', emoji: '🦚', missing: 'ט', choices: ['ט', 'ת', 'ס'] },
  { word: 'קוף', emoji: '🐒', missing: 'ק', choices: ['ק', 'כ', 'ף'] },
  { word: 'ברווז', emoji: '🦆', missing: 'ב', choices: ['ב', 'ו', 'ז'] },
  { word: 'היפופוטם', emoji: '🦛', missing: 'ה', choices: ['ה', 'ח', 'ת'] },
  { word: 'אריה', emoji: '🦁', missing: 'א', choices: ['א', 'ר', 'ה'] },
  { word: 'שועל', emoji: '🦊', missing: 'ש', choices: ['ש', 'ס', 'צ'] },
  { word: 'יעל', emoji: '🐐', missing: 'י', choices: ['י', 'ל', 'ע'] },
  { word: 'תנין', emoji: '🐊', missing: 'ת', choices: ['ת', 'נ', 'ן'] },
  { word: 'דולפין', emoji: '🐬', missing: 'ד', choices: ['ד', 'ל', 'פ'] },
]

function blankWord(word, missing) {
  const idx = word.indexOf(missing)
  if (idx === -1) return word
  return word.substring(0, idx) + '_' + word.substring(idx + 1)
}

function buildMediumQuestions() {
  // Type: complete-word-by-picture
  return pictureWords.map((item, i) => {
    const options = item.choices
    const correctIndex = options.findIndex((c) => c === item.missing)
    return {
      id: `medium-${i}`,
      level: 'medium',
      type: 'complete-word-by-picture',
      prompt: 'השלם את המילה לפי התמונה',
      image: item.emoji,
      wordWithBlank: blankWord(item.word, item.missing),
      options,
      correctIndex,
    }
  })
}

const matchPairs = [
  { emoji: '🐱', correct: 'חתול', wrong: ['כלב', 'דג'] },
  { emoji: '🐶', correct: 'כלב', wrong: ['חתול', 'דג'] },
  { emoji: '🐟', correct: 'דג', wrong: ['דולפין', 'זברה'] },
  { emoji: '🐴', correct: 'סוס', wrong: ['צבה', 'שועל'] },
  { emoji: '🐢', correct: 'צב', wrong: ['דוב', 'טווס'] },
  { emoji: '🦓', correct: 'זברה', wrong: ['גמל', 'חתול'] },
  { emoji: '🐪', correct: 'גמל', wrong: ['כלב', 'צב'] },
  { emoji: '🐋', correct: 'לוויתן', wrong: ['דולפין', 'דג'] },
  { emoji: '🦊', correct: 'שועל', wrong: ['סוס', 'פרפר'] },
  { emoji: '🐻', correct: 'דוב', wrong: ['דובה', 'אריה'] },
  { emoji: '🐯', correct: 'נמר', wrong: ['תנין', 'זברה'] },
  { emoji: '🐒', correct: 'קוף', wrong: ['כלב', 'חתול'] },
  { emoji: '🦛', correct: 'היפופוטם', wrong: ['דולפין', 'דוב'] },
  { emoji: '🦚', correct: 'טווס', wrong: ['תנין', 'צב'] },
  { emoji: '🦁', correct: 'אריה', wrong: ['דוב', 'כלב'] },
  { emoji: '🦋', correct: 'פרפר', wrong: ['זברה', 'גמל'] },
  { emoji: '🐬', correct: 'דולפין', wrong: ['לוויתן', 'דג'] },
  { emoji: '🐐', correct: 'יעל', wrong: ['כלב', 'חתול'] },
  { emoji: '🦝', correct: 'רקון', wrong: ['שועל', 'סוס'] },
  { emoji: '🐊', correct: 'תנין', wrong: ['דולפין', 'צב'] },
]

function buildHardQuestions() {
  // Mixed types 1–3
  const easy = buildEasyQuestions().slice(0, 20)
  const medium = buildMediumQuestions().slice(0, 20)
  const match = matchPairs.map((p, i) => {
    const options = [p.correct, ...p.wrong].sort(() => Math.random() - 0.5)
    const correctIndex = options.findIndex((o) => o === p.correct)
    return {
      id: `hard-match-${i}`,
      level: 'hard',
      type: 'match-word-to-picture',
      prompt: 'בחר את המילה המתאימה לתמונה',
      image: p.emoji,
      options,
      correctIndex,
    }
  })
  const hard = []
  // interleave to mix types
  for (let i = 0; i < 20; i++) {
    if (i < easy.length) hard.push({ ...easy[i], level: 'hard', id: `hard-easy-${i}` })
    if (i < medium.length) hard.push({ ...medium[i], level: 'hard', id: `hard-medium-${i}` })
    if (i < match.length) hard.push(match[i])
  }
  return hard.slice(0, 20)
}

export const questions = [
  ...buildEasyQuestions(), // 20
  ...buildMediumQuestions(), // 20
  ...buildHardQuestions(), // 20
]

export function getQuestionsForLevel(level) {
  if (level === 'easy') return questions.filter((q) => q.level === 'easy')
  if (level === 'medium') return questions.filter((q) => q.level === 'medium')
  if (level === 'hard') return questions.filter((q) => q.level === 'hard')
  return []
}



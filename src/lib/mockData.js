/**
 * Mock Assessment Questions
 * Contains example questions for all 4 question types
 */

export const mockQuestions = [
  {
    id: 'q1',
    type: 'likert',
    text: 'I enjoy organizing group projects.',
  },
  {
    id: 'q2',
    type: 'forced-choice',
    text: 'Would you rather:',
    optionA: 'Lead the team',
    optionB: 'Design the graphics',
  },
  {
    id: 'q3',
    type: 'scenario',
    text: 'Your teammate is slacking. What do you do?',
    options: [
      { id: 'a', text: 'Report them' },
      { id: 'b', text: 'Help them' },
    ],
  },
  {
    id: 'q4',
    type: 'aptitude',
    text: 'What is 12 * 12?',
    options: [
      { id: 'a', text: '144' },
      { id: 'b', text: '124' },
    ],
  },
];

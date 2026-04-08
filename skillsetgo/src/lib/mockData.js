/**
 * Mock Assessment Questions
 * Interest Explorer - First test available to all users
 * Mix of Likert scale (1-9) and Forced choice questions
 */

export const mockQuestions = [
  // SECTION 1: INTERESTS
  {
    id: 'q1',
    type: 'likert',
    text: 'I enjoy working with computers and technology to solve problems.',
  },
  {
    id: 'q2',
    type: 'forced-choice',
    text: 'In your free time, would you rather:',
    optionA: 'Read books or learn new concepts',
    optionB: 'Build or create something with your hands',
  },
  {
    id: 'q3',
    type: 'likert',
    text: 'I find it exciting to help people understand difficult concepts.',
  },
  {
    id: 'q4',
    type: 'forced-choice',
    text: 'Which appeals to you more:',
    optionA: 'Working independently on detailed analysis',
    optionB: 'Collaborating with a team on creative projects',
  },
  {
    id: 'q5',
    type: 'likert',
    text: 'I am interested in understanding how businesses operate and grow.',
  },
  {
    id: 'q6',
    type: 'forced-choice',
    text: 'When faced with a problem, do you prefer to:',
    optionA: 'Think it through logically and systematically',
    optionB: 'Use intuition and creative thinking',
  },
  {
    id: 'q7',
    type: 'likert',
    text: 'I enjoy exploring artistic and creative fields.',
  },
  {
    id: 'q8',
    type: 'forced-choice',
    text: 'Which career aspect matters more to you:',
    optionA: 'Earning high income and financial stability',
    optionB: 'Making a positive impact on society',
  },
  {
    id: 'q9',
    type: 'likert',
    text: 'I am comfortable with change and enjoy learning new things continuously.',
  },
  {
    id: 'q10',
    type: 'forced-choice',
    text: 'In academic subjects, you naturally excel in:',
    optionA: 'Math, Science, and Logic',
    optionB: 'Languages, History, and Social Studies',
  },
];

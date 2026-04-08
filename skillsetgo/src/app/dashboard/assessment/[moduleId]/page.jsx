'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/store/assessmentStore';
import { mockQuestions } from '@/lib/mockData';

/**
 * Assessment Test Engine
 * Renders one question at a time with smooth Framer Motion transitions
 */

export default function AssessmentPage({ params }) {
  const router = useRouter();
  const { 
    currentIndex, 
    responses, 
    setAnswer, 
    nextQuestion, 
    prevQuestion, 
    isSubmitted, 
    submitAssessment,
    reset 
  } = useAssessmentStore();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset on component mount
  useEffect(() => {
    reset();
  }, [reset]);

  const currentQuestion = mockQuestions[currentIndex];
  const progress = ((currentIndex + 1) / mockQuestions.length) * 100;
  const isLastQuestion = currentIndex === mockQuestions.length - 1;
  const allQuestionsAnswered = mockQuestions.every(q => responses[q.id] !== undefined);

  /**
   * Handle answer selection with smooth transition
   */
  const handleSelectAnswer = (answer) => {
    setAnswer(currentQuestion.id, answer);
    setIsTransitioning(true);

    // Wait 300ms for visual feedback, then move to next
    setTimeout(() => {
      if (!isLastQuestion) {
        nextQuestion();
      }
      setIsTransitioning(false);
    }, 300);
  };

  /**
   * Handle submission
   */
  const handleSubmit = () => {
    submitAssessment();
  };

  // Show completion screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center font-outfit">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-2xl w-full bg-[#FAF0DC] rounded-lg shadow-2xl p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#6B8B23] to-[#5a7519] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-outfit">
            Assessment Complete!
          </h1>

          <p className="text-lg text-gray-600 mb-2 font-outfit">
            Great job! You've completed the Interest Explorer Test.
          </p>

          <p className="text-gray-600 mb-8 font-outfit">
            You answered <strong>{Object.keys(responses).length}</strong> out of <strong>{mockQuestions.length}</strong> questions
          </p>

          <div className="bg-yellow-50 border-2 border-[#FDD355] rounded-lg p-6 mb-8">
            <p className="text-gray-700 font-medium font-outfit">
              Your responses have been recorded. Soon we'll analyze your answers and provide you with personalized career insights and recommendations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/student/dashboard')}
              className="flex-1 px-6 py-3 bg-[#6B8B23] text-white rounded-lg font-semibold hover:bg-[#5a7519] transition-colors shadow-md hover:shadow-lg font-outfit"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => router.push('/student/results')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors shadow-md hover:shadow-lg font-outfit"
            >
              View Results
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 font-outfit">
      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-gray-700 font-outfit">
            Question {currentIndex + 1} of {mockQuestions.length}
          </h2>
          <span className="text-sm text-gray-500 font-outfit">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#6B8B23] to-[#5a7519]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-2xl mx-auto">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="bg-[#FAF0DC] rounded-lg shadow-lg p-8"
        >
          {/* Question Text */}
          <h1 className="text-2xl font-bold text-gray-800 mb-8 font-outfit">
            {currentQuestion.text}
          </h1>

          {/* Dynamic Answer Input Based on Question Type */}
          <QuestionCard
            question={currentQuestion}
            onSelectAnswer={handleSelectAnswer}
            isTransitioning={isTransitioning}
          />
        </motion.div>

        {/* Navigation Buttons */}
        <div className="max-w-2xl mx-auto mt-8 flex gap-4">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-outfit"
          >
            Previous
          </button>
          {isLastQuestion && (
            <button 
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered}
              className="flex-1 px-4 py-3 bg-[#6B8B23] text-white rounded-lg font-medium hover:bg-[#5a7519] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-outfit"
            >
              {allQuestionsAnswered ? 'Submit Assessment' : 'Answer All Questions'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * QuestionCard Component
 * Renders different UI based on question type
 */
function QuestionCard({ question, onSelectAnswer, isTransitioning }) {
  const { responses } = useAssessmentStore();
  const selectedAnswer = responses[question.id];

  switch (question.type) {
    case 'likert':
      return (
        <LikertQuestion
          question={question}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={onSelectAnswer}
          isTransitioning={isTransitioning}
        />
      );

    case 'forced-choice':
      return (
        <ForcedChoiceQuestion
          question={question}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={onSelectAnswer}
          isTransitioning={isTransitioning}
        />
      );

    case 'scenario':
      return (
        <ScenarioQuestion
          question={question}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={onSelectAnswer}
          isTransitioning={isTransitioning}
        />
      );

    case 'aptitude':
      return (
        <AptitudeQuestion
          question={question}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={onSelectAnswer}
          isTransitioning={isTransitioning}
        />
      );

    default:
      return <p className="text-slate-500">Unknown question type</p>;
  }
}

/**
 * Likert Question (1-9 scale)
 */
function LikertQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
  isTransitioning,
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
          <motion.button
            key={value}
            onClick={() => onSelectAnswer(value)}
            disabled={isTransitioning}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all font-outfit ${
              selectedAnswer === value
                ? 'bg-[#6B8B23] text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-[#FDD355] hover:text-gray-800'
            } ${isTransitioning ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            <span className="block text-lg mb-1">{value}</span>
          </motion.button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-600 px-2 font-outfit">
        <span>Strongly Disagree</span>
        <span className="text-center">Neutral</span>
        <span>Strongly Agree</span>
      </div>
    </div>
  );
}

/**
 * Forced Choice Question (2 large options side-by-side)
 */
function ForcedChoiceQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
  isTransitioning,
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {[
        { value: 'A', label: question.optionA },
        { value: 'B', label: question.optionB },
      ].map(({ value, label }) => (
        <motion.button
          key={value}
          onClick={() => onSelectAnswer(value)}
          disabled={isTransitioning}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 rounded-lg font-semibold text-lg transition-all border-2 font-outfit ${
            selectedAnswer === value
              ? 'border-[#6B8B23] bg-[#F5F9E8] text-[#6B8B23] shadow-lg'
              : 'border-gray-200 bg-white text-gray-700 hover:border-[#FDD355] hover:bg-yellow-50'
          } ${isTransitioning ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          <div className="text-2xl font-bold mb-2">Option {value}</div>
          <div className="text-sm">{label}</div>
        </motion.button>
      ))}
    </div>
  );
}

/**
 * Scenario Question (with vertically stacked options)
 */
function ScenarioQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
  isTransitioning,
}) {
  return (
    <div className="space-y-4">
      {question.options.map((option) => (
        <motion.button
          key={option.id}
          onClick={() => onSelectAnswer(option.id)}
          disabled={isTransitioning}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full p-4 rounded-lg font-medium text-left transition-all border-2 font-outfit ${
            selectedAnswer === option.id
              ? 'border-[#6B8B23] bg-[#F5F9E8] text-[#6B8B23] shadow-md'
              : 'border-gray-200 bg-white text-gray-700 hover:border-[#FDD355] hover:bg-yellow-50'
          } ${isTransitioning ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {option.text}
        </motion.button>
      ))}
    </div>
  );
}

/**
 * Aptitude Question (standard vertical radio buttons)
 */
function AptitudeQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
  isTransitioning,
}) {
  return (
    <div className="space-y-3">
      {question.options.map((option) => (
        <motion.button
          key={option.id}
          onClick={() => onSelectAnswer(option.id)}
          disabled={isTransitioning}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full p-4 rounded-lg font-medium text-left transition-all border-2 flex items-center gap-4 font-outfit ${
            selectedAnswer === option.id
              ? 'border-[#6B8B23] bg-[#F5F9E8] text-[#6B8B23]'
              : 'border-gray-200 bg-white text-gray-700 hover:border-[#FDD355]'
          } ${isTransitioning ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              selectedAnswer === option.id
                ? 'border-[#6B8B23] bg-[#6B8B23]'
                : 'border-gray-300'
            }`}
          >
            {selectedAnswer === option.id && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
          {option.text}
        </motion.button>
      ))}
    </div>
  );
}

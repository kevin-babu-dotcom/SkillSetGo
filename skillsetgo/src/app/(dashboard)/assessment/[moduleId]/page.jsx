'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/store/assessmentStore';
import { useProfileStore } from '@/store/profileStore';
import { fetchTestSection, getTestTypeByClass, transformQuestionsToUIFormat } from '@/lib/questionBank';
import { submitTestResponses } from '@/lib/testSubmit';
import { saveTestProgress, loadTestProgress, clearTestProgress } from '@/lib/testProgress';
import { auth } from '@/firebase/config';

/**
 * Assessment Test Engine
 * Renders one question at a time with smooth Framer Motion transitions
 * Fetches real questions from Firestore based on student class
 */

export default function AssessmentPage({ params }) {
  // Unwrap params Promise at top level
  const unwrappedParams = React.use(params);
  
  const router = useRouter();
  const { 
    currentIndex, 
    responses, 
    setAnswer, 
    nextQuestion, 
    prevQuestion, 
    isSubmitted, 
    submitAssessment,
    reset,
    setCurrentIndex,
    setResponses
  } = useAssessmentStore();

  const { fetchUserProfile, getUserClass } = useProfileStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testType, setTestType] = useState(null);
  const [moduleId, setModuleId] = useState(null);
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);

  // Map moduleId to Firestore section names
  const moduleToSectionMap = {
    'career-interests': 'interests',
    'personality': 'personality',
    'aptitude': 'aptitude',
    'work-values': 'workValues',
    'eq': 'eq',
    'self-efficacy': 'selfEfficacy',
  };

  // Map moduleId to display name
  const moduleToNameMap = {
    'career-interests': 'Interests',
    'personality': 'Personality',
    'aptitude': 'Aptitude',
    'work-values': 'Work Values',
    'eq': 'Emotional Quotient',
    'self-efficacy': 'Self Efficacy',
  };

  const getTestTitle = () => {
    const baseName = moduleToNameMap[moduleId] || moduleId;
    
    // Special handling for interests test which is different per age group
    if (moduleId === 'career-interests') {
      if (testType === 'degreeExplorer') {
        return `${baseName} Test (Degree Explorer)`;
      } else {
        return `${baseName} Test (Stream Selector)`;
      }
    }
    
    return `${baseName} Test`;
  };

  // Reset on component mount and fetch questions
  useEffect(() => {
    reset();
    const id = unwrappedParams?.moduleId;
    setModuleId(id);
    if (id) {
      // Wait for auth state to be loaded before fetching questions
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          loadQuestions(id);
        } else {
          setError('User not authenticated');
          setIsLoading(false);
        }
      });
      
      return () => unsubscribe();
    }
  }, [reset, unwrappedParams]);

  const loadQuestions = async (currentModuleId) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get the current user (auth state is guaranteed to be loaded by now)
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated - session expired');
      }

      const token = await user.getIdToken();
      console.log('[assessment] Got auth token for user:', user.uid);

      // 2. Fetch user profile to get class
      console.log('[assessment] Fetching user profile...');
      const userProfile = await fetchUserProfile(token);
      console.log('[assessment] User profile loaded:', userProfile);
      
      const studentClass = userProfile?.class;
      if (!studentClass) {
        console.warn('[assessment] Warning: No class found in user profile');
      }

      // 3. Determine test type based on class
      const determinedTestType = getTestTypeByClass(studentClass);
      setTestType(determinedTestType);

      console.log('[assessment] Loaded user:', { class: studentClass, testType: determinedTestType, moduleId: currentModuleId });

      // 4. Map moduleId to Firestore section name
      const section = moduleToSectionMap[currentModuleId];
      if (!section) {
        throw new Error(`Unknown test module: ${currentModuleId}`);
      }

      // 5. Fetch questions for this section
      console.log('[assessment] Fetching questions from API...', { testType: determinedTestType, section });
      const sectionData = await fetchTestSection(determinedTestType, section, token);
      console.log('[assessment] API returned section data:', sectionData);

      // 6. Transform to UI format
      const formattedQuestions = transformQuestionsToUIFormat(section, sectionData);
      console.log('[assessment] Transformed questions:', { count: formattedQuestions.length, sample: formattedQuestions.slice(0, 2) });

      if (formattedQuestions.length === 0) {
        throw new Error('No questions returned from API - check if Firestore has data in questionBank collection');
      }

      setQuestions(formattedQuestions);

      // 7. Check if test is already in progress (saved in localStorage)
      const savedProgress = loadTestProgress(determinedTestType, section);
      if (savedProgress) {
        console.log('[assessment] ✓ Resuming test from saved progress:', { 
          currentIndex: savedProgress.currentIndex, 
          responseCount: Object.keys(savedProgress.responses).length 
        });
        // Restore responses from localStorage
        setResponses(savedProgress.responses);
        // Jump to where they left off
        setCurrentIndex(savedProgress.currentIndex);
      } else {
        console.log('[assessment] Starting fresh test');
      }

      setIsLoading(false);
      console.log('[assessment] ✓ Questions loaded successfully:', { count: formattedQuestions.length, testType: determinedTestType, section });
    } catch (err) {
      const errorMsg = err?.message || String(err);
      console.error('[assessment] ✗ Error loading questions:', errorMsg);
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const isLastQuestion = currentIndex === questions.length - 1;
  const allQuestionsAnswered = questions.length > 0 && questions.every(q => responses[q.id] !== undefined);

  /**
   * Handle answer selection with smooth transition
   */
  const handleSelectAnswer = (answer) => {
    setAnswer(currentQuestion.id, answer);
    const updatedResponses = { ...responses, [currentQuestion.id]: answer };
    
    setIsTransitioning(true);

    // Wait 300ms for visual feedback, then move to next
    setTimeout(() => {
      if (!isLastQuestion) {
        nextQuestion();
        
        // Save progress to localStorage after moving to next question
        if (testType && moduleId) {
          const section = moduleToSectionMap[moduleId];
          saveTestProgress(testType, section, currentIndex + 1, updatedResponses, startTime);
        }
      } else {
        // On the last question, save immediately without moving
        if (testType && moduleId) {
          const section = moduleToSectionMap[moduleId];
          saveTestProgress(testType, section, currentIndex, updatedResponses, startTime);
        }
      }
      setIsTransitioning(false);
    }, 300);
  };

  /**
   * Handle submission - score and submit to server
   */
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Save the answered count before any resets
      const numAnswered = Object.keys(responses).length;
      setAnsweredCount(numAnswered);

      const token = await user.getIdToken();
      const timeSpent = Date.now() - startTime;
      const section = moduleToSectionMap[moduleId];

      console.log('[assessment] Submitting test...', {
        testType,
        section,
        timeSpent,
        numResponses: numAnswered,
      });

      // Submit to API for server-side scoring
      const result = await submitTestResponses(
        testType,
        section,
        moduleId,
        responses,
        timeSpent,
        token
      );

      console.log('[assessment] Test submitted and scored:', result);
      setSubmissionResult(result);
      
      // Clear test progress from localStorage after successful submission
      clearTestProgress(testType, section);
      console.log('[assessment] Test progress cleared from localStorage');
      
      submitAssessment(); // Mark as submitted in local store
    } catch (err) {
      const errorMsg = err?.message || String(err);
      console.error('[assessment] Submission error:', errorMsg);
      alert(`Failed to submit test: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="text-9xl font-bold text-gray-100 opacity-5 absolute select-none">
            SkillSetGo
          </div>
        </div>
        <div className="relative z-10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-gray-300 border-t-[#6B8B23] rounded-full mx-auto mb-4"
          />
          <p className="text-slate-600 font-medium">Loading assessment...</p>
        </div>
      </div>
    );
  }

  // Show error state (but allow continuing with fallback)
  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="text-9xl font-bold text-gray-100 opacity-5 absolute select-none">
            SkillSetGo
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center relative z-10 border border-gray-100"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-4">⚠️ Failed to Load Real Questions</h1>
          <p className="text-slate-600 mb-4 font-mono text-sm bg-red-50 p-4 rounded">
            {error}
          </p>
          <p className="text-sm text-slate-600 mb-8 bg-gray-50 p-4 rounded">
            <strong>Possible causes:</strong>
            <ul className="text-left mt-2 space-y-1">
              <li>• No class set in your Firestore user profile</li>
              <li>• No tier/subscription level assigned</li>
              <li>• Firestore questionBank collection doesn't exist or is empty</li>
              <li>• Security rules blocking the API</li>
            </ul>
          </p>
          <button
            onClick={() => router.push('/student/dashboard')}
            className="px-6 py-3 bg-[#6B8B23] text-white rounded-lg font-semibold hover:bg-[#5a761e] transition-colors"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  // Show empty state if no questions
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="text-9xl font-bold text-gray-100 opacity-5 absolute select-none">
            SkillSetGo
          </div>
        </div>
        <div className="relative z-10 text-center">
          <p className="text-slate-600">No questions available</p>
        </div>
      </div>
    );
  }

  // Ensure currentQuestion exists
  if (!currentQuestion) {
    return null;
  }

  // Show completion screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="text-9xl font-bold text-gray-100 opacity-5 absolute select-none">
            SkillSetGo
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center relative z-10 border border-gray-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#6B8B23] to-[#5a761e] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>

          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Assessment Complete!
          </h1>

          <p className="text-lg text-slate-600 mb-2">
            Great job! You've completed the {getTestTitle()}.
          </p>

          <p className="text-slate-500 mb-8">
            You answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions
          </p>

          {submissionResult && submissionResult.scores && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">📊 Preliminary Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(submissionResult.scores).map(([key, value]) => (
                  <div key={key} className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-slate-600 capitalize font-medium">{key}</p>
                    <p className="text-2xl font-bold text-[#6B8B23]">
                      {typeof value === 'object' ? '✓' : value}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-600 mt-4">
                These are your preliminary scores. A detailed analysis will be available soon.
              </p>
            </div>
          )}

          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-8">
            <p className="text-slate-700 font-medium">
              Your responses have been recorded and scored. A comprehensive analysis with personalized career insights and recommendations will be available shortly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/student/dashboard')}
              className="flex-1 px-6 py-3 bg-[#6B8B23] text-white rounded-lg font-semibold hover:bg-[#5a761e] transition-colors shadow-md hover:shadow-lg"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => router.push('/student/results')}
              className="flex-1 px-6 py-3 bg-gray-200 text-slate-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors shadow-md hover:shadow-lg"
            >
              View Results
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white -mt-10 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Transparent Background Logo */}
      
      {/* Content Container */}
      <div className="relative z-5 w-full">
        {/* Warning banner if using fallback questions */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Using sample questions</strong> — Real questions failed to load. Check browser console for details.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-slate-700">
              Question {currentIndex + 1} of {questions.length}
            </h2>
            <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#6B8B23] to-[#5a761e]"
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
            className="bg-[#faf0dc] rounded-2xl shadow-xl py-15 px-10 border -mx-10 border-[#6b8b23]"
          >
            {/* Question Text */}
            <h1 className="text-5xl font-bold text-slate-800 mb-8">
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
              onClick={() => {
                prevQuestion();
                // Save progress when navigating
                if (testType && moduleId) {
                  const section = moduleToSectionMap[moduleId];
                  saveTestProgress(testType, section, currentIndex - 1, responses, startTime);
                }
              }}
              disabled={currentIndex === 0}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-[#6b8b23] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
            >
              ← Previous
            </button>
            {isLastQuestion && (
              <button 
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered || isSubmitting}
                className="flex-1 px-4 py-3 bg-[#6B8B23] text-white rounded-lg font-semibold hover:bg-[#5a761e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Submitting...
                  </>
                ) : (
                  allQuestionsAnswered ? 'Submit Assessment' : 'Answer All Questions'
                )}
              </button>
            )}
          </div>
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
    <div className="space-y-8">
      <div className="flex justify-between gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
          <motion.button
            key={value}
            onClick={() => onSelectAnswer(value)}
            disabled={isTransitioning}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-4 rounded-full font-semibold text-sm transition-all ${
              selectedAnswer === value
                ? 'bg-gradient-to-br from-[#6B8B23] to-[#5a761e] text-white shadow-lg'
                : 'bg-gradient-to-br from-[#F0F4E8] to-[#E8F0DC] text-slate-700 hover:from-[#E8F0DC] hover:to-[#DFE8CC] border-2 border-[#D4E0B8]'
            } ${isTransitioning ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <span className="block text-lg font-bold mb-1">{value}</span>
          </motion.button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-600 px-2 mt-6">
        <span className="font-medium">Strongly Disagree</span>
        <span className="text-center font-medium">Neutral</span>
        <span className="font-medium">Strongly Agree</span>
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
          className={`p-6 rounded-full font-semibold text-lg transition-all border-2 ${
            selectedAnswer === value
              ? 'border-[#6b8b23]  bg-[#6b8b23] text-white shadow-lg'
              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#6b8b23] hover:bg-[#6b8b23]'
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
          className={`w-full p-4 rounded-full font-medium text-left transition-all border-2 ${
            selectedAnswer === option.id
              ? 'border-[#6b8b23] bg-[#6b8b23] text-white shadow-md'
              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#6b8b23] hover:bg-[#6b8b23]'
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
          className={`w-full p-4 rounded-full font-medium text-left transition-all border-2 flex items-center gap-4 ${
            selectedAnswer === option.id
              ? 'border-[#6b8b23] bg-[#6b8b23] text-white'
              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#6b8b23]'
          } ${isTransitioning ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              selectedAnswer === option.id
                ? 'border-[#6b8b23] bg-[#6b8b23]'
                : 'border-slate-300'
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

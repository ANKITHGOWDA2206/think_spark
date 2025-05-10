
import { create } from 'zustand';
import { QuizQuestion, QuestionService, QuizParameters } from '@/services/QuestionService';
import { Matchmaker, Opponent } from '@/services/Matchmaker';
import { toast } from 'sonner';

interface QuizSettings {
  domain: string;
  subject: string;
  topic: string;
  difficulty: string;
  opponentType: string;
  numberOfQuestions: number;
}

type QuizStage = 'lobby' | 'battle' | 'results';

interface QuizState {
  // Quiz state
  quizStage: QuizStage;
  quizSettings: Partial<QuizSettings>;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  playerScore: number;
  opponentScore: number;
  opponent: Opponent | null;
  timeLeft: number;
  quizStartTime: number;
  quizEndTime: number | null;
  questionsAnswered: number;
  correctAnswers: number;
  quizDuration: number;
  
  // Actions
  setQuizStage: (stage: QuizStage) => void;
  startQuiz: (settings: Partial<QuizSettings>) => Promise<void>;
  answerQuestion: (optionId: string) => boolean;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

export const useQuizState = create<QuizState>((set, get) => ({
  // Initial state
  quizStage: 'lobby',
  quizSettings: {},
  questions: [],
  currentQuestionIndex: 0,
  playerScore: 0,
  opponentScore: 0,
  opponent: null,
  timeLeft: 0,
  quizStartTime: 0,
  quizEndTime: null,
  questionsAnswered: 0,
  correctAnswers: 0,
  quizDuration: 0,
  
  // Action to set the quiz stage
  setQuizStage: (stage) => set({ quizStage: stage }),
  
  // Action to start a new quiz
  startQuiz: async (settings) => {
    try {
      // Show loading toast
      toast.loading("Generating questions...");
      
      // Reset the quiz state first
      set({
        quizSettings: settings,
        playerScore: 0,
        opponentScore: 0,
        currentQuestionIndex: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        quizStartTime: Date.now(),
        quizEndTime: null
      });
      
      // Find an opponent
      const matchResult = await Matchmaker.findOpponent(
        settings.opponentType || 'ai',
        settings.difficulty || 'medium'
      );
      
      // Get quiz questions based on difficulty
      const quizParams: QuizParameters = {
        domain: settings.domain || 'ai',
        subject: settings.subject || 'deep_learning',
        topic: settings.topic || 'cnn',
        difficulty: settings.difficulty || 'medium',
        numberOfQuestions: settings.numberOfQuestions || 5
      };
      
      const questions = await QuestionService.getQuestions(quizParams);
      
      // Dismiss the loading toast
      toast.dismiss();
      
      // Show success toast
      toast.success(`${questions.length} questions loaded successfully!`);
      
      // Update the quiz state
      set({
        questions,
        opponent: matchResult.opponent,
        quizStage: 'battle'
      });
    } catch (error) {
      console.error('Failed to start quiz:', error);
      
      // Dismiss the loading toast
      toast.dismiss();
      
      // Show error toast
      toast.error("Failed to generate questions. Please try again.");
      
      // Handle error - stay in lobby
    }
  },
  
  // Action to answer the current question
  answerQuestion: (optionId) => {
    const { questions, currentQuestionIndex, opponent } = get();
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.correctOption === optionId;
    
    // Update player score and stats
    set(state => ({
      playerScore: isCorrect ? state.playerScore + 1 : state.playerScore,
      questionsAnswered: state.questionsAnswered + 1,
      correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers
    }));
    
    // Simulate opponent answering with difficulty-based intelligence
    setTimeout(() => {
      const opponentSkill = opponent?.skillLevel || 5;
      const difficulty = get().quizSettings.difficulty || 'medium';
      
      // Base chance of correctness based on difficulty and opponent skill
      let opponentChance = 0.5; // Default 50% chance
      
      if (difficulty === 'easy') {
        opponentChance = 0.3 + (opponentSkill / 30); // 30% to 63% chance
      } else if (difficulty === 'medium') {
        opponentChance = 0.4 + (opponentSkill / 20); // 40% to 90% chance
      } else if (difficulty === 'hard') {
        opponentChance = 0.5 + (opponentSkill / 15); // 50% to 100% chance
      } else if (difficulty === 'expert') {
        opponentChance = 0.6 + (opponentSkill / 12); // 60% to 100% chance - very challenging
      }
      
      // Additional factors - make the opponent more likely to get it right if the player got it right
      if (isCorrect) {
        opponentChance += 0.1; // Opponent is more likely to also be correct
      }
      
      // Cap the chance at 95% to allow for some unpredictability even at expert level
      opponentChance = Math.min(opponentChance, 0.95);
      
      // Determine if opponent got it correct
      const opponentCorrect = Math.random() < opponentChance;
      
      if (opponentCorrect) {
        set(state => ({
          opponentScore: state.opponentScore + 1
        }));
      }
    }, 1500);
    
    return isCorrect;
  },
  
  // Action to move to the next question or end the quiz
  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    
    if (currentQuestionIndex < questions.length - 1) {
      // Move to the next question
      set(state => ({
        currentQuestionIndex: state.currentQuestionIndex + 1
      }));
    } else {
      // End the quiz
      const quizEndTime = Date.now();
      const quizStartTime = get().quizStartTime;
      
      // Show completion toast
      toast.success("Quiz completed! Check your results.");
      
      set({
        quizStage: 'results',
        quizEndTime,
        quizDuration: Math.floor((quizEndTime - quizStartTime) / 1000)
      });
    }
  },
  
  // Action to reset the quiz
  resetQuiz: () => {
    set({
      quizStage: 'lobby',
      questions: [],
      currentQuestionIndex: 0,
      playerScore: 0,
      opponentScore: 0,
      opponent: null,
      quizSettings: {}
    });
  }
}));

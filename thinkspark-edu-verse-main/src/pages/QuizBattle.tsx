
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QuizLobby from '@/components/QuizBattle/QuizLobby';
import BattleRoom from '@/components/QuizBattle/BattleRoom';
import ResultScreen from '@/components/QuizBattle/ResultScreen';
import { useQuizState } from '@/hooks/useQuizState';

const QuizBattle: React.FC = () => {
  const { user } = useAppContext();
  const { 
    quizStage, 
    quizSettings, 
    questions,
    playerScore,
    opponentScore,
    setQuizStage,
    resetQuiz 
  } = useQuizState();
  
  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Quiz Battle</h1>
        <p className="text-gray-500 mb-6">Please log in to access Quiz Battle</p>
        <Link to="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Quiz Battle</h1>
      
      {quizStage === 'lobby' && (
        <QuizLobby />
      )}
      
      {quizStage === 'battle' && (
        <BattleRoom />
      )}
      
      {quizStage === 'results' && (
        <ResultScreen 
          onPlayAgain={() => setQuizStage('lobby')}
        />
      )}
    </div>
  );
};

export default QuizBattle;

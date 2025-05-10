
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Trophy, BarChart, ArrowRight, User, Book, Clock } from 'lucide-react';
import { useQuizState } from '@/hooks/useQuizState';
import { Link } from 'react-router-dom';

interface ResultScreenProps {
  onPlayAgain: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ onPlayAgain }) => {
  const { 
    playerScore, 
    opponentScore, 
    quizSettings,
    questionsAnswered,
    correctAnswers,
    quizDuration
  } = useQuizState();
  
  const isWinner = playerScore > opponentScore;
  const isDraw = playerScore === opponentScore;
  
  const accuracy = questionsAnswered > 0
    ? Math.round((correctAnswers / questionsAnswered) * 100)
    : 0;
    
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6 overflow-hidden">
        <div className={`h-2 ${isWinner ? 'bg-green-500' : isDraw ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            {isWinner ? (
              <div className="bg-green-100 p-4 rounded-full">
                <Trophy className="h-12 w-12 text-green-600" />
              </div>
            ) : isDraw ? (
              <div className="bg-blue-100 p-4 rounded-full">
                <BarChart className="h-12 w-12 text-blue-600" />
              </div>
            ) : (
              <div className="bg-amber-100 p-4 rounded-full">
                <Book className="h-12 w-12 text-amber-600" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-2xl">
            {isWinner ? 'Victory!' : isDraw ? 'It\'s a Draw!' : 'Better Luck Next Time!'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-center items-center mb-8 gap-12">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <User className="h-6 w-6 mr-1 text-primary" />
                <span>You</span>
              </div>
              <div className="text-4xl font-bold">{playerScore}</div>
            </div>
            
            <div className="text-lg font-medium">vs</div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Book className="h-6 w-6 mr-1 text-secondary" />
                <span>AI</span>
              </div>
              <div className="text-4xl font-bold">{opponentScore}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500 mb-1">Accuracy</div>
              <div className="text-2xl font-bold text-primary">{accuracy}%</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500 mb-1">Questions</div>
              <div className="text-2xl font-bold text-primary">
                {correctAnswers}/{questionsAnswered}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500 mb-1">Time</div>
              <div className="text-2xl font-bold text-primary">
                {formatTime(quizDuration)}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <h3 className="text-lg font-medium mb-2">Quiz Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Domain</div>
                <div>{quizSettings.domain?.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Subject</div>
                <div>{quizSettings.subject?.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Topic</div>
                <div>{quizSettings.topic?.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Difficulty</div>
                <div className="capitalize">{quizSettings.difficulty}</div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={onPlayAgain}
            className="w-full sm:w-auto"
          >
            Play Again
          </Button>
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              Back to Dashboard <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResultScreen;

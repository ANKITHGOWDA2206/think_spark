
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, User, Book, Clock, HelpCircle } from 'lucide-react';
import { useQuizState } from '@/hooks/useQuizState';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const BattleRoom: React.FC = () => {
  const { 
    questions, 
    currentQuestionIndex, 
    playerScore, 
    opponentScore,
    quizSettings,
    timeLeft,
    answerQuestion,
    nextQuestion
  } = useQuizState();
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [optionStates, setOptionStates] = useState<Record<string, 'correct' | 'incorrect' | 'selected' | null>>({});
  const [answered, setAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(
    quizSettings.difficulty === 'easy' ? 30 : 
    quizSettings.difficulty === 'medium' ? 25 : 
    quizSettings.difficulty === 'hard' ? 20 : 
    quizSettings.difficulty === 'expert' ? 15 : 30
  );
  
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  useEffect(() => {
    // Reset states when moving to a new question
    setSelectedOption(null);
    setOptionStates({});
    setAnswered(false);
    setShowExplanation(false);
    
    // Reset timer based on difficulty
    setTimeRemaining(
      quizSettings.difficulty === 'easy' ? 30 : 
      quizSettings.difficulty === 'medium' ? 25 : 
      quizSettings.difficulty === 'hard' ? 20 : 
      quizSettings.difficulty === 'expert' ? 15 : 30
    );
  }, [currentQuestionIndex, quizSettings.difficulty]);
  
  // Timer effect
  useEffect(() => {
    if (answered) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Auto-submit when time runs out
          if (!answered && !selectedOption) {
            toast.warning("Time's up!");
            handleSubmitAnswer();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [answered, selectedOption]);
  
  const handleOptionSelect = (optionId: string) => {
    if (answered) return;
    
    setSelectedOption(optionId);
    setOptionStates(prev => ({
      ...prev,
      [optionId]: 'selected'
    }));
  };
  
  const handleSubmitAnswer = () => {
    if (answered) return;
    
    if (!selectedOption) {
      // If no option selected, treat as incorrect
      toast.error("No answer selected! Moving to next question.");
      setAnswered(true);
      return;
    }
    
    const isCorrect = answerQuestion(selectedOption);
    
    // Update UI to show correct/incorrect answers
    const newOptionStates: Record<string, 'correct' | 'incorrect' | 'selected' | null> = {};
    
    currentQuestion.options.forEach(option => {
      if (option.id === currentQuestion.correctOption) {
        newOptionStates[option.id] = 'correct';
      } else if (option.id === selectedOption) {
        newOptionStates[option.id] = 'incorrect';
      }
    });
    
    setOptionStates(newOptionStates);
    setAnswered(true);
    
    // Show toast notification based on answer
    if (isCorrect) {
      toast.success("Correct answer! +1 point");
    } else {
      toast.error("Incorrect answer!");
    }
    
    // Simulate opponent answering after a delay
    setTimeout(() => {
      // In a real implementation, this would be based on difficulty and opponent AI
      const opponentCorrect = Math.random() > 0.5;
      
      if (opponentCorrect) {
        toast("Your opponent answered correctly!", {
          icon: <Book className="h-4 w-4 text-primary" />
        });
      } else {
        toast("Your opponent answered incorrectly!", {
          icon: <Book className="h-4 w-4 text-muted-foreground" />
        });
      }
    }, 1500);
  };
  
  const getOptionClass = (optionId: string) => {
    if (optionStates[optionId] === 'correct') {
      return 'border-green-500 bg-green-50';
    } else if (optionStates[optionId] === 'incorrect') {
      return 'border-red-500 bg-red-50';
    } else if (selectedOption === optionId) {
      return 'border-primary bg-primary/10';
    }
    return 'border-gray-200 hover:border-primary hover:bg-gray-50';
  };
  
  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Badge variant="outline" className="mr-2 text-primary">
            {quizSettings.domain && quizSettings.domain.replace('_', ' ').toUpperCase()}
          </Badge>
          <Badge variant="outline" className="mr-2">
            {quizSettings.subject && quizSettings.subject.replace('_', ' ')}
          </Badge>
          <Badge variant="outline">
            {quizSettings.topic && quizSettings.topic.replace('_', ' ')}
          </Badge>
        </div>
        
        <Badge variant={quizSettings.difficulty === 'expert' ? "destructive" : 
                        quizSettings.difficulty === 'hard' ? "secondary" : 
                        quizSettings.difficulty === 'medium' ? "outline" : 
                        "default"} 
              className="mr-2">
          {quizSettings.difficulty && quizSettings.difficulty.charAt(0).toUpperCase() + quizSettings.difficulty.slice(1)}
        </Badge>
        
        <Badge variant="outline" className="text-sm">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </Badge>
      </div>
      
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <User className="h-6 w-6 mr-2 text-primary" />
          <div>
            <div className="text-sm font-medium">You</div>
            <div className="text-2xl font-bold">{playerScore}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-amber-500" />
          <div className="text-lg font-medium">
            {timeRemaining}s
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="text-right">
            <div className="text-sm font-medium">Opponent</div>
            <div className="text-2xl font-bold">{opponentScore}</div>
          </div>
          <Book className="h-6 w-6 ml-2 text-secondary" />
        </div>
      </div>
      
      <Progress value={progressPercentage} className="h-2 mb-6" />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <RadioGroup value={selectedOption || ""} onValueChange={handleOptionSelect} disabled={answered}>
            {currentQuestion.options.map(option => (
              <div key={option.id} 
                className={`flex items-center space-x-2 p-3 rounded-md border transition-colors ${getOptionClass(option.id)}`}>
                <RadioGroupItem value={option.id} id={`option-${option.id}`} disabled={answered} />
                <label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
                  <div className="flex items-center">
                    {optionStates[option.id] === 'correct' && (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    )}
                    {optionStates[option.id] === 'incorrect' && (
                      <XCircle className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                    )}
                    <span>{option.text}</span>
                  </div>
                </label>
              </div>
            ))}
          </RadioGroup>
          
          {answered && currentQuestion.explanation && (
            <div className="mt-6">
              <Button variant="outline" onClick={toggleExplanation} className="mb-2 w-full flex items-center justify-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                {showExplanation ? "Hide Explanation" : "Show Explanation"}
              </Button>
              
              {showExplanation && (
                <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
                  <h4 className="font-medium mb-2">Explanation:</h4>
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {!answered ? (
            <Button 
              onClick={handleSubmitAnswer} 
              disabled={!selectedOption}
              className="w-full"
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              onClick={nextQuestion} 
              className="w-full"
            >
              {currentQuestionIndex === totalQuestions - 1 ? 'See Results' : 'Next Question'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default BattleRoom;


import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { useInteractionStore } from '@/services/InteractionTracker';
import { CareerSuggestor } from '@/services/CareerSuggestor';
import { useResumeStore } from '@/services/ResumeService';
import ResumePromptModal from '@/components/Resume/ResumePromptModal';

const CareerAdvisor: React.FC = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const { queries } = useInteractionStore();
  const { getAllResumes, createResume } = useResumeStore();
  const [showPrompt, setShowPrompt] = useState(false);
  const [suggestedCareers, setSuggestedCareers] = useState([]);
  
  useEffect(() => {
    // Check if we have enough queries to make a suggestion
    if (queries.length >= 3) {
      const domains = CareerSuggestor.analyzeUserQueries(queries);
      const careers = CareerSuggestor.suggestCareers(domains);
      setSuggestedCareers(careers);
      
      // Show the prompt after a short delay to simulate analysis
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [queries]);
  
  const handleCareerSelect = (career) => {
    const newResume = createResume(career);
    setShowPrompt(false);
    navigate(`/resume-builder/${newResume.id}`);
  };
  
  const resumes = getAllResumes();
  
  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Career Advisor</h1>
        <p className="text-gray-500 mb-6">Please log in to access the Career Advisor</p>
        <Link to="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Career Advisor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-2 md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Career Advisor</CardTitle>
                <CardDescription>Get personalized career recommendations based on your interests</CardDescription>
              </div>
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Our AI analyzes your recent interactions to suggest career paths that align with your interests.</p>
              
              {queries.length < 3 ? (
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Keep exploring to get personalized suggestions</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(queries.length / 3) * 100}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-500">{queries.length}/3</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Try interacting with the AI Assistant or exploring topics in the Quiz Battle feature
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-100 p-4 rounded-md">
                  <h3 className="font-medium text-green-800 mb-2">Ready for career suggestions!</h3>
                  <p className="text-green-700">
                    Based on your interactions, we can now provide personalized career recommendations.
                  </p>
                  <Button className="mt-4" onClick={() => setShowPrompt(true)}>
                    View Career Suggestions
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Resumes</CardTitle>
            <CardDescription>Manage your saved resumes</CardDescription>
          </CardHeader>
          <CardContent>
            {resumes.length === 0 ? (
              <div className="text-center py-6">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No resumes yet</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {resumes.slice(0, 4).map((resume) => (
                  <li key={resume.id}>
                    <Link 
                      to={`/resume-builder/${resume.id}`} 
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{resume.name || "Unnamed Resume"}</p>
                        <p className="text-xs text-gray-500">
                          {resume.careerPath?.title || "General Resume"}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate(`/resume-builder/${createResume().id}`)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Resume
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Resume prompt modal */}
      <ResumePromptModal 
        isOpen={showPrompt}
        onClose={() => setShowPrompt(false)}
        onConfirm={handleCareerSelect}
        careers={suggestedCareers}
      />
    </div>
  );
};

export default CareerAdvisor;

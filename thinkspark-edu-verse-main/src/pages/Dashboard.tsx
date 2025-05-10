import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Trophy, User, ArrowRight, Bell, Activity, BookOpen, Star, Calendar, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import UpcomingClasses from '@/components/Classes/UpcomingClasses';
import UpcomingClassesTeacher from '@/components/Classes/UpcomingClassesTeacher';
import PastClassesTeacher from '@/components/Classes/PastClassesTeacher';

const Dashboard: React.FC = () => {
  const { user, currentStreak, ideas, toggleAIAssistant } = useAppContext();
  
  // Display a welcome page if not logged in
  if (!user) {
    return (
      <div className="py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to <span className="text-primary">ThinkSpark</span></h1>
          <p className="text-xl mb-8 text-gray-600">
            The AI-powered education platform designed to make learning engaging and fun.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="card-hover">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Book className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-center">Interactive Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  Engage with gamified lessons and quizzes that adapt to your learning style.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Star className="h-12 w-12 text-accent" />
                </div>
                <CardTitle className="text-center">Innovation Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  Share and collaborate on ideas with peers and teachers.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <BookOpen className="h-12 w-12 text-secondary" />
                </div>
                <CardTitle className="text-center">AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  Get personalized help with subjects and turn any topic into an engaging story.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-x-4">
            <Link to="/login">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Different dashboards for student and teacher roles
  if (user.role === 'teacher') {
    return <TeacherDashboard />;
  }
  
  // Student dashboard
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        
        <div className="flex items-center bg-amber-50 text-amber-700 px-4 py-2 rounded-full">
          <Trophy className="h-5 w-5 mr-2 text-accent" />
          <span className="font-medium">{currentStreak} Day Streak</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-2 card-hover">
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Join your scheduled classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UpcomingClasses />
          </CardContent>
          <CardFooter>
            <Link to="/classes">
              <Button variant="ghost" className="flex items-center">
                View all classes <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/quiz">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Start Quiz Battle</p>
                  <p className="text-sm text-gray-500">Test your knowledge</p>
                </div>
              </div>
            </Link>
            
            <button onClick={() => toggleAIAssistant()} className="w-full">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Chat with AI</p>
                  <p className="text-sm text-gray-500">Get help with any topic</p>
                </div>
              </div>
            </button>
            
            <button onClick={() => { 
              toggleAIAssistant(); 
              // Small timeout to ensure the component is mounted before trying to change tabs
              setTimeout(() => {
                const storyTab = document.querySelector('[value="story"]') as HTMLButtonElement;
                if (storyTab) storyTab.click();
              }, 100);
            }} className="w-full">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Book className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Generate Story</p>
                  <p className="text-sm text-gray-500">Create educational stories</p>
                </div>
              </div>
            </button>
            
            <Link to="/career-advisor">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Career Advisor</p>
                  <p className="text-sm text-gray-500">Explore career paths & build resume</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Latest Innovations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {ideas.slice(0, 3).map((idea) => (
          <Card key={idea.id} className="card-hover">
            {idea.imageUrl && (
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={idea.imageUrl} 
                  alt={idea.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="sparkle">{idea.title}</CardTitle>
              <CardDescription>
                {new Date(idea.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-gray-700">{idea.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-4">
                <span className="text-sm text-gray-500 flex items-center">
                  <Bell className="h-4 w-4 mr-1" /> {idea.likes}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <User className="h-4 w-4 mr-1" /> {idea.comments}
                </span>
              </div>
              <Link to={`/innovation/${idea.id}`}>
                <Button variant="ghost" size="sm">View</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Link to="/innovation">
          <Button variant="outline">
            View All Innovations <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

// Teacher Dashboard Component
const TeacherDashboard: React.FC = () => {
  const { user } = useAppContext();
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        
        <Link to="/schedule-class">
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule New Class
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Classes you've scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingClassesTeacher />
          </CardContent>
          <CardFooter>
            <Link to="/classes">
              <Button variant="ghost" className="flex items-center">
                View all classes <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Past Classes</CardTitle>
            <CardDescription>Review previous classes</CardDescription>
          </CardHeader>
          <CardContent>
            <PastClassesTeacher />
          </CardContent>
          <CardFooter>
            <Link to="/classes/history">
              <Button variant="ghost" className="flex items-center">
                View class history <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Student Innovations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Reuse the ideas display from student dashboard but without the streak display */}
      </div>
      
      <div className="text-center">
        <Link to="/innovation">
          <Button variant="outline">
            View All Student Innovations <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

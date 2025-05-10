import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import VideoClassRoom from '@/components/VideoClassRoom/VideoClassRoom';

interface Class {
  id: string;
  teacher_id: string;
  subject: string;
  topic: string;
  start_time: string;
  duration: number;
  class_code: string;
  room_url?: string;
  teacher_name?: string;
  attendees_count?: number;
}

const Classes: React.FC = () => {
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<Class[]>([]);
  const [pastClasses, setPastClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, getTeacherClasses, getUpcomingClasses } = useAppContext();
  
  useEffect(() => {
    const loadClasses = async () => {
      try {
        // Load classes based on user role
        let classes: Class[] = [];
        
        if (user?.role === 'teacher') {
          classes = await getTeacherClasses();
        } else {
          classes = await getUpcomingClasses();
        }
        
        // Sort and filter classes
        const now = new Date();
        const upcoming = classes.filter(c => {
          const classEnd = new Date(new Date(c.start_time).getTime() + c.duration * 60000);
          return classEnd >= now;
        }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
        
        const past = classes.filter(c => {
          const classEnd = new Date(new Date(c.start_time).getTime() + c.duration * 60000);
          return classEnd < now;
        }).sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
        
        setAllClasses(classes);
        setUpcomingClasses(upcoming);
        setPastClasses(past);
      } catch (error) {
        console.error("Failed to load classes", error);
      }
    };
    
    loadClasses();
  }, [user, getTeacherClasses, getUpcomingClasses]);
  
  const isClassLive = (startTime: string, durationMinutes: number) => {
    const classStart = new Date(startTime);
    const classEnd = new Date(classStart.getTime() + durationMinutes * 60000);
    const now = new Date();
    
    return now >= classStart && now <= classEnd;
  };
  
  const handleOpenDetails = (classItem: Class) => {
    setSelectedClass(classItem);
    setDialogOpen(true);
  };
  
  const renderClassItem = (classItem: Class) => {
    const startTime = new Date(classItem.start_time);
    const isLive = isClassLive(classItem.start_time, classItem.duration);
    const isTeacher = user?.role === 'teacher';
    const classPath = isTeacher ? `/teach-class/${classItem.id}` : `/class/${classItem.id}`;
    
    return (
      <div 
        key={classItem.id} 
        className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-4"
      >
        <div className="flex items-start space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          
          <div>
            <h4 className="font-medium">{classItem.subject}</h4>
            <p className="text-sm text-gray-500">{classItem.topic}</p>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {' • '}
              {classItem.duration} min
              {isTeacher && (
                <span className="flex items-center ml-1">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  {classItem.attendees_count || 0}
                </span>
              )}
              {classItem.room_url && (
                <span className="ml-2 flex items-center text-blue-500">
                  <Video className="h-3.5 w-3.5 mr-1" />
                  Video Class
                </span>
              )}
            </div>
          </div>
        </div>
        
        {isLive ? (
          <Link to={classPath}>
            <Button className="bg-green-600 hover:bg-green-700">
              {isTeacher ? 'Start Class' : 'Join Now'}
            </Button>
          </Link>
        ) : (
          <div className="flex items-center space-x-2">
            {isTeacher && (
              <div className="text-sm text-gray-500">
                Class Code: <span className="font-medium">{classItem.class_code}</span>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleOpenDetails(classItem)}
            >
              Details
            </Button>
          </div>
        )}
      </div>
    );
  };
  
  if (!user) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Classes</h1>
        <p className="text-gray-500">Please log in to view classes</p>
        <Link to="/login" className="mt-4 inline-block">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Classes</h1>
        
        {user.role === 'teacher' && (
          <Link to="/schedule-class">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule New Class
            </Button>
          </Link>
        )}
      </div>
      
      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All Classes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingClasses.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No upcoming classes scheduled
            </div>
          ) : (
            upcomingClasses.map(renderClassItem)
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {pastClasses.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No past classes found
            </div>
          ) : (
            pastClasses.map(renderClassItem)
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          {allClasses.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No classes found
            </div>
          ) : (
            allClasses.map(renderClassItem)
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedClass?.subject}: {selectedClass?.topic}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedClass?.room_url ? (
              <VideoClassRoom roomUrl={selectedClass.room_url} className="mb-4" />
            ) : (
              <div className="bg-gray-800 aspect-video rounded-lg flex items-center justify-center text-white">
                <div className="text-center">
                  <Video className="mx-auto h-16 w-16 mb-4 opacity-50" />
                  <p>No video room available for this class</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Teacher</h4>
                <p>{selectedClass?.teacher_name || "Teacher"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                <p>{selectedClass?.duration} minutes</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Start Time</h4>
                <p>{selectedClass && new Date(selectedClass.start_time).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Class Code</h4>
                <p className="font-mono bg-gray-100 p-1 rounded">{selectedClass?.class_code}</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              {selectedClass && (
                <Link to={user?.role === 'teacher' ? `/teach-class/${selectedClass.id}` : `/class/${selectedClass.id}`}>
                  <Button className="bg-primary hover:bg-primary/90">
                    Go to Class Page
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Classes;

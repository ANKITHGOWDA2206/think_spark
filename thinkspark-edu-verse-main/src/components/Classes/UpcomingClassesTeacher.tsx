
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';

interface Class {
  id: string;
  teacher_id: string;
  subject: string;
  topic: string;
  start_time: string;
  duration: number;
  class_code: string;
  room_url?: string;
  attendees_count?: number;
}

export const UpcomingClassesTeacher: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const { getTeacherClasses } = useAppContext();
  
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const teacherClasses = await getTeacherClasses();
        
        // Filter for upcoming classes (happening now or in the future)
        const now = new Date();
        const upcoming = teacherClasses.filter(c => new Date(c.start_time) >= now);
        
        setClasses(upcoming || []);
      } catch (error) {
        console.error("Failed to load teacher's classes", error);
      }
    };
    
    loadClasses();
  }, [getTeacherClasses]);
  
  const isClassLive = (startTime: string, durationMinutes: number) => {
    const classStart = new Date(startTime);
    const classEnd = new Date(classStart.getTime() + durationMinutes * 60000);
    const now = new Date();
    
    return now >= classStart && now <= classEnd;
  };
  
  if (classes.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No upcoming classes scheduled
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {classes.map((classItem) => {
        const startTime = new Date(classItem.start_time);
        const isLive = isClassLive(classItem.start_time, classItem.duration);
        
        return (
          <div 
            key={classItem.id} 
            className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
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
                  {' • '}
                  <span className="flex items-center ml-1">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    {classItem.attendees_count || 0}
                  </span>
                  {classItem.room_url && (
                    <span className="ml-2 flex items-center text-blue-500">
                      <Video className="h-3.5 w-3.5 mr-1" />
                      Video Room
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {isLive ? (
              <Link to={`/teach-class/${classItem.id}`}>
                <Button className="bg-green-600 hover:bg-green-700">
                  Start Class
                </Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-500">
                  Class Code: <span className="font-medium">{classItem.class_code}</span>
                </div>
                <Link to={`/class-details/${classItem.id}`}>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </Link>
              </div>
            )}
          </div>
        );
      })}
      
      <div className="flex justify-center mt-2">
        <Link to="/schedule-class">
          <Button variant="outline" size="sm" className="flex items-center">
            Schedule a new class
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UpcomingClassesTeacher;

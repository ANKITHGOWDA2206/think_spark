
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users } from 'lucide-react';
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
  attendees_count?: number;
}

export const PastClassesTeacher: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const { getTeacherClasses } = useAppContext();
  
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const teacherClasses = await getTeacherClasses();
        
        // Filter for past classes
        const now = new Date();
        const past = teacherClasses
          .filter(c => {
            const classEnd = new Date(new Date(c.start_time).getTime() + c.duration * 60000);
            return classEnd < now;
          })
          .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
          .slice(0, 3); // Get latest 3 past classes
        
        setClasses(past || []);
      } catch (error) {
        console.error("Failed to load teacher's past classes", error);
      }
    };
    
    loadClasses();
  }, [getTeacherClasses]);
  
  if (classes.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No past classes found
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {classes.map((classItem) => {
        const startTime = new Date(classItem.start_time);
        
        return (
          <div 
            key={classItem.id} 
            className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-gray-200 p-3 rounded-full">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
              
              <div>
                <h4 className="font-medium">{classItem.subject}</h4>
                <p className="text-sm text-gray-500">{classItem.topic}</p>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {startTime.toLocaleDateString()} at {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' • '}
                  <span className="flex items-center ml-1">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    {classItem.attendees_count || 0} attended
                  </span>
                </div>
              </div>
            </div>
            
            <Link to={`/class-details/${classItem.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default PastClassesTeacher;

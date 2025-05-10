
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, VideoOff, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import VideoClassRoom from '@/components/VideoClassRoom/VideoClassRoom';

const LiveClass: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const { user, markAttendance, getClassDetails } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [classDetails, setClassDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  // Load class details
  useEffect(() => {
    const loadClass = async () => {
      try {
        if (classId) {
          const details = await getClassDetails(classId);
          setClassDetails(details);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load class details", error);
        toast({
          title: "Error Loading Class",
          description: "Could not load class details. Please try again.",
          variant: "destructive"
        });
        navigate("/");
      }
    };
    
    loadClass();
  }, [classId, getClassDetails, navigate, toast]);
  
  const handleMarkAttendance = async () => {
    if (!classId || !user) return;
    
    try {
      await markAttendance(classId, user.id, 'present');
      setAttendanceMarked(true);
      toast({
        title: "Attendance Marked",
        description: "Your presence has been recorded",
      });
    } catch (error) {
      console.error("Failed to mark attendance", error);
      toast({
        title: "Attendance Error",
        description: "Failed to mark your attendance",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading class...</div>;
  }
  
  if (!classDetails) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Class Not Found</h2>
        <p className="mb-6">The requested class could not be found or has ended.</p>
        <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')} 
        className="mb-6 flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{classDetails.subject}: {classDetails.topic}</CardTitle>
            </CardHeader>
            <CardContent>
              {classDetails.room_url ? (
                <VideoClassRoom roomUrl={classDetails.room_url} className="mb-4" />
              ) : (
                <div className="bg-gray-800 aspect-video rounded-lg flex items-center justify-center text-white">
                  <div className="text-center">
                    <Video className="mx-auto h-16 w-16 mb-4 opacity-50" />
                    <p>No video room available for this class</p>
                  </div>
                </div>
              )}

              {!attendanceMarked && (
                <div className="mt-4">
                  <Button 
                    onClick={handleMarkAttendance} 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Mark Attendance
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Class Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Subject</h4>
                  <p>{classDetails.subject}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Topic</h4>
                  <p>{classDetails.topic}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Teacher</h4>
                  <p>{classDetails.teacher_name || "Teacher"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                  <p>{classDetails.duration} minutes</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Class Code</h4>
                  <p className="font-mono bg-gray-100 p-1 rounded">{classDetails.class_code}</p>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Attendance Status</h4>
                  {attendanceMarked ? (
                    <div className="flex items-center text-green-600">
                      <ThumbsUp className="mr-2 h-5 w-5" />
                      Present
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-600">
                      <ThumbsUp className="mr-2 h-5 w-5" />
                      Click "Mark Attendance" button to record your presence
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveClass;

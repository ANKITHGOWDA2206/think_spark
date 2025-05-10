
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Book, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import { createDailyRoom } from '@/utils/dailyApi';

const ScheduleClass: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  
  const { toast } = useToast();
  const { user, scheduleClass } = useAppContext();
  const navigate = useNavigate();
  
  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || !topic || !date || !startTime || !duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsCreatingRoom(true);
      // Convert to a proper date-time format
      const startDateTime = new Date(`${date}T${startTime}`);
      
      // Create a Daily.co room
      const roomUrl = await createDailyRoom();
      
      await scheduleClass({
        teacher_id: user?.id || '',
        subject,
        topic,
        start_time: startDateTime.toISOString(),
        duration: parseInt(duration),
        class_code: generateClassCode(),
        room_url: roomUrl
      });
      
      toast({
        title: "Class Scheduled",
        description: "Your class has been successfully scheduled with video conferencing"
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule the class. Please try again.",
        variant: "destructive"
      });
      console.error("Schedule class error:", error);
    } finally {
      setIsCreatingRoom(false);
    }
  };
  
  // Generate a simple class code (in a real app, you might want a more robust solution)
  const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };
  
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Schedule a New Class</h1>
      
      <Card>
        <form onSubmit={handleSchedule}>
          <CardHeader>
            <CardTitle>Class Details</CardTitle>
            <CardDescription>
              Fill in the information for your upcoming class
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                placeholder="e.g. Mathematics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                type="text"
                placeholder="e.g. Calculus: Integration"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 pointer-events-none" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Start Time</Label>
                <div className="relative">
                  <Input
                    id="time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                  <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="15"
                max="180"
                step="15"
                required
              />
            </div>
            
            <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-800">Video Conferencing</h3>
              </div>
              <p className="text-sm text-blue-700">
                A Daily.co video room will be automatically created for this class.
                Students can join the class through the link when it's time.
              </p>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isCreatingRoom}
            >
              {isCreatingRoom ? 'Creating Room...' : 'Schedule Class'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ScheduleClass;

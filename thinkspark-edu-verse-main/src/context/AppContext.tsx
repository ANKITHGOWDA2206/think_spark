import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

export type UserRole = 'student' | 'teacher';

interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface Idea {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  likes: number;
  comments: number;
}

interface Class {
  id: string;
  teacher_id: string;
  subject: string;
  topic: string;
  start_time: string;
  duration: number;
  class_code: string;
  teacher_name?: string;
  attendees_count?: number;
  room_url?: string;
}

interface ClassScheduleData {
  teacher_id: string;
  subject: string;
  topic: string;
  start_time: string;
  duration: number;
  class_code: string;
  room_url?: string;
}

interface AttendanceData {
  student_id: string;
  class_id: string;
  status: 'present' | 'absent' | 'late';
}

interface QuizScore {
  student_id: string;
  score: number;
  grade: string;
  subject: string;
  topic: string;
  timestamp: string;
}

interface AppContextType {
  user: User | null;
  ideas: Idea[];
  isLoggedIn: boolean;
  currentStreak: number;
  isAIAssistantOpen: boolean;
  toggleAIAssistant: () => void;
  login: (role: UserRole) => void;
  logout: () => void;
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'likes' | 'comments'>) => void;
  scheduleClass: (classData: ClassScheduleData) => Promise<void>;
  getUpcomingClasses: () => Promise<Class[]>;
  getTeacherClasses: () => Promise<Class[]>;
  getClassDetails: (classId: string) => Promise<Class | null>;
  markAttendance: (classId: string, studentId: string, status: AttendanceData['status']) => Promise<void>;
  validateEmail: (email: string) => boolean;
  saveQuizScore: (quizScore: QuizScore) => Promise<void>;
  generateSummary: (inputText: string) => Promise<{english: string, kannada: string}>;
}

// Default values for our context
const defaultContext: AppContextType = {
  user: null,
  ideas: [],
  isLoggedIn: false,
  currentStreak: 0,
  isAIAssistantOpen: false,
  toggleAIAssistant: () => {},
  login: () => {},
  logout: () => {},
  addIdea: () => {},
  scheduleClass: async () => {},
  getUpcomingClasses: async () => [],
  getTeacherClasses: async () => [],
  getClassDetails: async () => null,
  markAttendance: async () => {},
  validateEmail: () => false,
  saveQuizScore: async () => {},
  generateSummary: async () => ({ english: '', kannada: '' })
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  
  // OpenRouter API Key
  const API_KEY = "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";
  
  // Mock ideas data
  const mockIdeas: Idea[] = [
    {
      id: '1',
      userId: 'user1',
      title: 'AI-Powered Plant Care Assistant',
      description: 'An app that uses computer vision to identify plant diseases and provide care instructions.',
      imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070',
      createdAt: new Date().toISOString(),
      likes: 12,
      comments: 5
    },
    {
      id: '2',
      userId: 'user2',
      title: 'Underwater Drone for Ocean Cleanup',
      description: 'A remotely operated drone that can collect microplastics from ocean surfaces.',
      imageUrl: 'https://images.unsplash.com/photo-1518399681578-c057c519f745?q=80&w=2074',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      likes: 24,
      comments: 8
    },
    {
      id: '3',
      userId: 'user3',
      title: 'Solar-Powered Water Purifier',
      description: 'A compact device that uses solar energy to purify contaminated water in rural areas.',
      imageUrl: 'https://images.unsplash.com/photo-1543946207-39bd91e70ca7?q=80&w=1974',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      likes: 18,
      comments: 3
    }
  ];
  
  // Mock classes data
  const mockClasses: Class[] = [
    {
      id: 'class1',
      teacher_id: 'teacher123',
      subject: 'Mathematics',
      topic: 'Calculus: Integration Techniques',
      start_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      duration: 60,
      class_code: 'MATH101',
      teacher_name: 'Mrs. Sharma',
      attendees_count: 0
    },
    {
      id: 'class2',
      teacher_id: 'teacher123',
      subject: 'Physics',
      topic: 'Electromagnetism: Maxwell\'s Equations',
      start_time: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
      duration: 45,
      class_code: 'PHYS202',
      teacher_name: 'Mrs. Sharma',
      attendees_count: 0
    },
    {
      id: 'class3',
      teacher_id: 'teacher456',
      subject: 'Chemistry',
      topic: 'Organic Chemistry: Functional Groups',
      start_time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      duration: 60,
      class_code: 'CHEM303',
      teacher_name: 'Mr. Patel',
      attendees_count: 15
    }
  ];
  
  // Initialize state with mock data
  React.useEffect(() => {
    setIdeas(mockIdeas);
    setClasses(mockClasses);
    
    // Simulate a streak for student demo
    if (user && user.role === 'student') {
      setCurrentStreak(5);
    } else {
      setCurrentStreak(0);
    }
  }, [user]);
  
  const login = (role: UserRole) => {
    setUser({
      id: role === 'student' ? 'student123' : 'teacher123',
      name: role === 'student' ? 'Aditya' : 'Mrs. Sharma',
      role: role,
      avatar: role === 'student' 
        ? 'https://ui-avatars.com/api/?name=Aditya&background=6d28d9&color=fff' 
        : 'https://ui-avatars.com/api/?name=Sharma&background=2563eb&color=fff'
    });
    
    // Set streak only for students
    if (role === 'student') {
      setCurrentStreak(5);
    }
  };
  
  const logout = () => {
    setUser(null);
    setCurrentStreak(0);
  };
  
  const toggleAIAssistant = () => {
    setIsAIAssistantOpen(prev => !prev);
  };
  
  const addIdea = (idea: Omit<Idea, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
    const newIdea: Idea = {
      ...idea,
      id: `idea-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0
    };
    
    setIdeas(prev => [newIdea, ...prev]);
  };
  
  // Class scheduling functions
  const scheduleClass = async (classData: ClassScheduleData) => {
    // In a real app, this would connect to Supabase
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newClass: Class = {
          ...classData,
          id: `class-${Date.now()}`,
          teacher_name: user?.name,
          attendees_count: 0
        };
        
        setClasses(prev => [...prev, newClass]);
        resolve();
      }, 500);
    });
  };
  
  const getUpcomingClasses = async () => {
    // In a real app, this would fetch from Supabase
    return new Promise<Class[]>((resolve) => {
      setTimeout(() => {
        const now = new Date();
        const futureClasses = classes.filter(c => {
          const classEnd = new Date(new Date(c.start_time).getTime() + c.duration * 60000);
          return classEnd > now;
        }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
        
        resolve(futureClasses.slice(0, 3)); // Return only the next 3 classes
      }, 300);
    });
  };
  
  const getTeacherClasses = async () => {
    // In a real app, this would filter by teacher ID from Supabase
    return new Promise<Class[]>((resolve) => {
      if (!user || user.role !== 'teacher') {
        resolve([]);
        return;
      }
      
      setTimeout(() => {
        const teacherClasses = classes.filter(c => c.teacher_id === user.id);
        resolve(teacherClasses);
      }, 300);
    });
  };
  
  const getClassDetails = async (classId: string) => {
    // In a real app, this would fetch from Supabase
    return new Promise<Class | null>((resolve) => {
      setTimeout(() => {
        const foundClass = classes.find(c => c.id === classId);
        resolve(foundClass || null);
      }, 300);
    });
  };
  
  const markAttendance = async (classId: string, studentId: string, status: AttendanceData['status']) => {
    // In a real app, this would insert to Supabase
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Update the streak count for the student
        if (status === 'present' && user && user.role === 'student') {
          setCurrentStreak(prev => prev + 1);
        }
        
        // Update attendees count in the class
        setClasses(prev => prev.map(c => {
          if (c.id === classId) {
            return {
              ...c,
              attendees_count: (c.attendees_count || 0) + 1
            };
          }
          return c;
        }));
        
        resolve();
      }, 500);
    });
  };
  
  const validateEmail = (email: string) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };
  
  const saveQuizScore = async (quizScore: QuizScore) => {
    // In a real app, this would insert to Supabase
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Quiz score saved:', quizScore);
        resolve();
      }, 300);
    });
  };
  
  const generateSummary = async (inputText: string) => {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openrouter/gpt-4",
          messages: [
            { 
              role: "user", 
              content: `Summarize this topic in both English and Kannada (use Kannada script):\n${inputText}
              
              Format your response as follows:
              
              # English Summary
              [English summary here]
              
              # Kannada Summary
              [Kannada summary here]` 
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      // Extract English and Kannada summaries
      const content = response.data.choices[0].message.content;
      const englishMatch = content.match(/# English Summary\s+([\s\S]*?)(?=\s+# Kannada Summary|$)/);
      const kannadaMatch = content.match(/# Kannada Summary\s+([\s\S]*?)$/);
      
      const englishSummary = englishMatch ? englishMatch[1].trim() : "Summary not available";
      const kannadaSummary = kannadaMatch ? kannadaMatch[1].trim() : "ಸಾರಾಂಶ ಲಭ್ಯವಿಲ್ಲ";
      
      return {
        english: englishSummary,
        kannada: kannadaSummary
      };
    } catch (error) {
      console.error("Error generating summary:", error);
      return {
        english: "Failed to generate summary.",
        kannada: "ಸಾರಾಂಶ ರಚಿಸಲು ವಿಫಲವಾಗಿದೆ."
      };
    }
  };
  
  return (
    <AppContext.Provider value={{ 
      user, 
      ideas, 
      isLoggedIn: !!user, 
      currentStreak, 
      isAIAssistantOpen,
      toggleAIAssistant,
      login, 
      logout,
      addIdea,
      scheduleClass,
      getUpcomingClasses,
      getTeacherClasses,
      getClassDetails,
      markAttendance,
      validateEmail,
      saveQuizScore,
      generateSummary
    }}>
      {children}
    </AppContext.Provider>
  );
};

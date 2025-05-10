
import React, { useState } from 'react';
import { X, Send, Mic, Volume2, Book, MessageSquare } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useInteractionStore } from '@/services/InteractionTracker';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const { toggleAIAssistant } = useAppContext();
  const { addQuery } = useInteractionStore();
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState('');
  const [recording, setRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI learning assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  // OpenRouter API Key
  const API_KEY = "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";
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Track this interaction for career suggestions
    addQuery(message);
    
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      text: message,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    try {
      // Get AI response from OpenRouter API
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openrouter/mistralai/mistral-tiny", // Free AI model
          messages: [
            { 
              role: "system", 
              content: "You are a helpful educational AI assistant for students. Provide clear, accurate, and age-appropriate answers." 
            },
            { 
              role: "user", 
              content: message 
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
      
      const aiResponseText = response.data.choices[0].message.content;
      
      const aiResponse: Message = {
        id: `msg-${Date.now()}-ai`,
        text: aiResponseText,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Fallback message if API call fails
      const fallbackResponse: Message = {
        id: `msg-${Date.now()}-ai`,
        text: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    }
  };
  
  const handleGenerateStory = async () => {
    if (!topic.trim()) return;
    
    // Track this interaction for career suggestions
    addQuery(`Generate story about ${topic}`);
    
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openrouter/mistralai/mistral-tiny", // Free AI model
          messages: [
            { 
              role: "system", 
              content: "You are a creative storyteller and educator. Create engaging, educational stories for students." 
            },
            { 
              role: "user", 
              content: `Write a short, engaging educational story about ${topic} that would be interesting for a student. Include a title for the story.` 
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
      
      const storyResponse = response.data.choices[0].message.content;
      setGeneratedStory(storyResponse);
      setTopic('');
    } catch (error) {
      console.error("Error generating story:", error);
      setGeneratedStory("Sorry, I couldn't generate a story right now. Please try again later.");
    }
  };
  
  const toggleRecording = () => {
    setRecording(!recording);
    // Track voice interaction for career suggestions
    if (!recording) {
      addQuery("Voice recording session");
    }
    // In a real implementation, this would start/stop the microphone recording
  };
  
  const speakText = (text: string) => {
    if (!text || isSpeaking) return;
    
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 animate-fade-in z-50">
      <div className="bg-primary text-white p-3 rounded-t-lg flex items-center justify-between">
        <h3 className="font-medium">AI Learning Assistant</h3>
        <Button variant="ghost" size="sm" onClick={toggleAIAssistant} className="text-white hover:bg-primary/80 p-0 h-auto">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center justify-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center justify-center">
            <Volume2 className="h-4 w-4 mr-2" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="story" className="flex items-center justify-center">
            <Book className="h-4 w-4 mr-2" />
            Story
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  msg.isUser 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="voice" className="flex-1 flex flex-col p-4">
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 mb-4">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${recording ? 'bg-red-100 animate-pulse-soft' : 'bg-gray-100'}`}>
              <Mic className={`h-12 w-12 ${recording ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
            <p className="text-center text-gray-600">
              {recording 
                ? "I'm listening... Tap to stop recording." 
                : "Tap the microphone to start speaking"}
            </p>
          </div>
          
          <Button 
            onClick={toggleRecording}
            className={recording ? "bg-red-500 hover:bg-red-600" : ""}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </Button>
        </TabsContent>
        
        <TabsContent value="story" className="flex-1 flex flex-col p-4">
          <div className="mb-4">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              Enter a topic for your story
            </label>
            <Input 
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Photosynthesis, Ancient Egypt"
              className="mb-2"
            />
            <Button onClick={handleGenerateStory} disabled={!topic.trim()} className="w-full">
              Generate Story
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-3">
            {generatedStory ? (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => speakText(generatedStory)}
                    disabled={isSpeaking}
                    className="flex items-center"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {isSpeaking ? "Speaking..." : "Listen"}
                  </Button>
                </div>
                {generatedStory.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700">{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center italic">
                Your generated story will appear here...
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAssistant;

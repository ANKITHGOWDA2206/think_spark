
import React, { useState } from 'react';
import { ArrowLeft, Brain, Copy, Volume2, Loader2, MessageSquare, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AIAssistant: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState({ english: '', kannada: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // For chatbot tab
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  // For story tab
  const [storyTopic, setStoryTopic] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [generatingStory, setGeneratingStory] = useState(false);
  
  // OpenRouter API Key
  const API_KEY = "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";
  
  const generateSummary = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to summarize",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setSummary({ english: '', kannada: '' });
    
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openrouter/mistralai/mistral-tiny", // Free AI model
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
      
      setSummary({
        english: englishSummary,
        kannada: kannadaSummary
      });
      
      toast({
        title: "Summary Generated",
        description: "Your summary is ready in both languages",
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateStory = async () => {
    if (!storyTopic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic for your story",
        variant: "destructive",
      });
      return;
    }
    
    setGeneratingStory(true);
    setGeneratedStory('');
    
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
              content: `Write a short, engaging educational story about ${storyTopic} that would be interesting for a student. Include a title for the story.` 
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
      
      const storyContent = response.data.choices[0].message.content;
      setGeneratedStory(storyContent);
      
      toast({
        title: "Story Generated",
        description: "Your educational story is ready",
      });
    } catch (error) {
      console.error("Error generating story:", error);
      toast({
        title: "Error",
        description: "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingStory(false);
    }
  };
  
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { role: "user", content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);
    
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openrouter/mistralai/mistral-tiny", // Free AI model
          messages: [
            { role: "system", content: "You are a helpful educational AI assistant for students. Provide clear, accurate, and age-appropriate answers." },
            ...chatMessages,
            userMessage
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      const assistantMessage = response.data.choices[0].message;
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setChatLoading(false);
    }
  };
  
  const speakText = (text: string, lang: string = 'en-US') => {
    if (!text || isSpeaking) return;
    
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Speech Error",
          description: "There was an error with text-to-speech. Please try again.",
          variant: "destructive",
        });
      };
      
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied!",
          description: "Text copied to clipboard",
        });
      },
      () => {
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        });
      }
    );
  };
  
  return (
    <div className="container mx-auto py-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')} 
        className="mb-6 flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">AI Assistant</h1>
        <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full">
          <Brain className="h-5 w-5 mr-2" />
          <span className="font-medium">Powered by AI</span>
        </div>
      </div>
      
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="summary">Voice Summary</TabsTrigger>
          <TabsTrigger value="story">Story Generator</TabsTrigger>
          <TabsTrigger value="chat">Educational Chatbot</TabsTrigger>
        </TabsList>
        
        {/* Voice Summary Tab */}
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Voice Summary Tool</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="input-text">
                  Enter your text or topic to summarize
                </label>
                <Textarea
                  id="input-text"
                  placeholder="Enter a topic or paste content to be summarized in both English and Kannada..."
                  rows={5}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="resize-none"
                />
              </div>
              
              <Button 
                onClick={generateSummary} 
                disabled={isLoading || !inputText.trim()} 
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating Summary...' : 'Generate Summary'}
              </Button>
              
              {(summary.english || summary.kannada) && (
                <div className="space-y-6 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">English Summary</h3>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => speakText(summary.english, 'en-US')}
                          disabled={isSpeaking}
                        >
                          <Volume2 className="h-4 w-4 mr-2" />
                          Listen
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(summary.english)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      {summary.english.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">ಕನ್ನಡ ಸಾರಾಂಶ (Kannada Summary)</h3>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => speakText(summary.kannada, 'kn-IN')}
                          disabled={isSpeaking}
                        >
                          <Volume2 className="h-4 w-4 mr-2" />
                          ಆಲಿಸಿ
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(summary.kannada)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          ನಕಲಿಸಿ
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      {summary.kannada.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Story Generator Tab */}
        <TabsContent value="story">
          <Card>
            <CardHeader>
              <CardTitle>Educational Story Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="story-topic">
                  Enter a topic for your educational story
                </label>
                <Input
                  id="story-topic"
                  placeholder="e.g., Photosynthesis, Ancient Egypt, Quantum Physics..."
                  value={storyTopic}
                  onChange={(e) => setStoryTopic(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={generateStory} 
                disabled={generatingStory || !storyTopic.trim()} 
                className="w-full"
              >
                {generatingStory && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {generatingStory ? 'Creating Your Story...' : 'Generate Educational Story'}
              </Button>
              
              {generatedStory && (
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Your Story</h3>
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => speakText(generatedStory)}
                        disabled={isSpeaking}
                      >
                        <Volume2 className="h-4 w-4 mr-2" />
                        Listen to Story
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(generatedStory)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {generatedStory.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Educational Chatbot Tab */}
        <TabsContent value="chat">
          <Card className="relative">
            <CardHeader>
              <CardTitle>Educational Chatbot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-md">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <Brain className="mx-auto h-12 w-12 mb-2 opacity-30" />
                    <p>Ask me any educational question!</p>
                    <p className="text-sm mt-2">I can explain concepts, solve problems, or help with homework.</p>
                  </div>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div 
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.role === 'user' 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {msg.content.split('\n').map((line, j) => (
                          <p key={j} className={j > 0 ? 'mt-2' : ''}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))
                )}
                
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 p-3 rounded-lg flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Thinking...
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex w-full gap-2">
                <Input
                  placeholder="Ask any educational question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendChatMessage();
                    }
                  }}
                  disabled={chatLoading}
                />
                <Button 
                  onClick={sendChatMessage} 
                  disabled={chatLoading || !chatInput.trim()}
                >
                  {chatLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MessageSquare className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAssistant;

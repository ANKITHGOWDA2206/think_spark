import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOption: string;
  explanation?: string;
}

export interface QuizParameters {
  domain: string;
  subject: string;
  topic: string;
  difficulty: string;
  numberOfQuestions: number;
}

// OpenRouter API Key
const OPENROUTER_API_KEY = "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";

export class QuestionService {
  // Mock data for when API fails or for offline development
  private static mockQuestions: Record<string, Partial<QuizQuestion>[]> = {
    // AI > Deep Learning > CNN
    cnn: [
      {
        question: "What does CNN stand for in the context of deep learning?",
        options: [
          { id: "0", text: "Complex Neural Network" },
          { id: "1", text: "Convolutional Neural Network" },
          { id: "2", text: "Cascading Neural Nodes" },
          { id: "3", text: "Computational Neural Network" }
        ],
        correctOption: "1"
      },
      {
        question: "Which layer in a CNN performs feature extraction?",
        options: [
          { id: "0", text: "Fully connected layer" },
          { id: "1", text: "Convolutional layer" },
          { id: "2", text: "Pooling layer" },
          { id: "3", text: "Normalization layer" }
        ],
        correctOption: "1"
      },
      {
        question: "What is the primary purpose of pooling layers in CNNs?",
        options: [
          { id: "0", text: "To increase the number of features" },
          { id: "1", text: "To add non-linearity" },
          { id: "2", text: "To reduce spatial dimensions" },
          { id: "3", text: "To normalize inputs" }
        ],
        correctOption: "2"
      },
      {
        question: "Which of these is NOT a common type of pooling in CNNs?",
        options: [
          { id: "0", text: "Max pooling" },
          { id: "1", text: "Average pooling" },
          { id: "2", text: "Min pooling" },
          { id: "3", text: "Sum pooling" }
        ],
        correctOption: "2"
      },
      {
        question: "Which CNN architecture won the ImageNet challenge in 2012?",
        options: [
          { id: "0", text: "VGG-16" },
          { id: "1", text: "ResNet" },
          { id: "2", text: "AlexNet" },
          { id: "3", text: "GoogleNet" }
        ],
        correctOption: "2"
      }
    ],

    // CS > OS > Memory Management
    memory_management: [
      {
        question: "What is virtual memory?",
        options: [
          { id: "0", text: "A type of RAM that's faster than regular RAM" },
          { id: "1", text: "A memory management technique using secondary storage" },
          { id: "2", text: "A special register in the CPU" },
          { id: "3", text: "A cloud-based storage solution" }
        ],
        correctOption: "1"
      },
      {
        question: "What is a page fault?",
        options: [
          { id: "0", text: "An error in the page table" },
          { id: "1", text: "When a process accesses a page not currently in physical memory" },
          { id: "2", text: "A corrupted memory page" },
          { id: "3", text: "When a page gets swapped" }
        ],
        correctOption: "1"
      },
      {
        question: "Which of the following is NOT a page replacement algorithm?",
        options: [
          { id: "0", text: "FIFO (First-In-First-Out)" },
          { id: "1", text: "LRU (Least Recently Used)" },
          { id: "2", text: "MRU (Most Recently Used)" },
          { id: "3", text: "LIFO (Last-In-First-Out)" }
        ],
        correctOption: "3"
      },
      {
        question: "What is fragmentation in memory management?",
        options: [
          { id: "0", text: "Breaking a process into multiple parts" },
          { id: "1", text: "Wasted memory space due to allocation and deallocation" },
          { id: "2", text: "Corrupted memory addresses" },
          { id: "3", text: "A security vulnerability" }
        ],
        correctOption: "1"
      },
      {
        question: "What is thrashing in an operating system?",
        options: [
          { id: "0", text: "A virus that damages memory" },
          { id: "1", text: "CPU spending too much time on page swapping" },
          { id: "2", text: "Memory overflow" },
          { id: "3", text: "Too many processes competing for CPU time" }
        ],
        correctOption: "1"
      }
    ],
    
    // Additional CS topics
    data_structures: [
      {
        question: "Which data structure operates on a LIFO principle?",
        options: [
          { id: "0", text: "Queue" },
          { id: "1", text: "Stack" },
          { id: "2", text: "Linked List" },
          { id: "3", text: "Binary Tree" }
        ],
        correctOption: "1"
      },
      {
        question: "What is the time complexity of binary search?",
        options: [
          { id: "0", text: "O(n)" },
          { id: "1", text: "O(log n)" },
          { id: "2", text: "O(n²)" },
          { id: "3", text: "O(1)" }
        ],
        correctOption: "1"
      }
    ],
    
    networking: [
      {
        question: "Which protocol is used for secure web browsing?",
        options: [
          { id: "0", text: "HTTP" },
          { id: "1", text: "HTTPS" },
          { id: "2", text: "FTP" },
          { id: "3", text: "SMTP" }
        ],
        correctOption: "1"
      },
      {
        question: "What is a subnet mask used for?",
        options: [
          { id: "0", text: "To hide the IP address" },
          { id: "1", text: "To divide an IP network into subnetworks" },
          { id: "2", text: "To encrypt data packets" },
          { id: "3", text: "To increase network speed" }
        ],
        correctOption: "1"
      }
    ]
  };

  // Generate a set of quiz questions based on the parameters
  public static async getQuestions(params: QuizParameters): Promise<QuizQuestion[]> {
    try {
      // Use OpenRouter API to generate questions
      const questions = await this.generateQuestionsWithAI(params);
      return questions;
    } catch (error) {
      console.error("Error generating questions with AI:", error);
      
      // Fallback to mock data if API fails
      console.log("Falling back to mock data");
      return this.getQuestionsFromMock(params);
    }
  }
  
  // Generate questions using OpenRouter API
  private static async generateQuestionsWithAI(params: QuizParameters): Promise<QuizQuestion[]> {
    const { domain, subject, topic, difficulty, numberOfQuestions } = params;
    
    // Construct the prompt for the AI
    const prompt = `Generate ${numberOfQuestions} ${difficulty} difficulty multiple choice quiz questions about ${topic} in ${subject} (${domain}). 
    Each question should have exactly 4 options with one correct answer. 
    Format your response as a valid JSON array of objects with the following structure:
    [
      {
        "question": "Question text here?",
        "options": [
          {"text": "Option A"},
          {"text": "Option B"},
          {"text": "Option C"},
          {"text": "Option D"}
        ],
        "correctOption": "0, 1, 2, or 3 (index of correct option)",
        "explanation": "Optional explanation of the correct answer"
      }
    ]`;
    
    // Make the API request
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/gpt-4",
        messages: [
          { role: "system", content: "You are a quiz question generator specialized in creating educational content. Output only valid JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    // Extract the content from the response
    const aiResponseText = response.data.choices[0].message.content;
    
    // Parse the JSON response
    try {
      // Find and extract the JSON part of the response
      const jsonStr = aiResponseText.replace(/```json|```/g, '').trim();
      const aiQuestions = JSON.parse(jsonStr);
      
      // Convert the AI-generated questions to our format
      return aiQuestions.map((q: any, index: number) => {
        // Ensure each option has an ID
        const options = q.options.map((opt: any, i: number) => ({
          id: opt.id || i.toString(),
          text: opt.text
        }));
        
        return {
          id: uuidv4(),
          question: q.question,
          options: options,
          correctOption: q.correctOption.toString(),
          explanation: q.explanation || undefined
        };
      }).slice(0, numberOfQuestions); // Ensure we only return the requested number
    } catch (error) {
      console.error("Error parsing AI response:", error, aiResponseText);
      throw new Error("Failed to parse AI-generated questions");
    }
  }
  
  // Get questions from mock data as a fallback
  private static getQuestionsFromMock(params: QuizParameters): QuizQuestion[] {
    const { topic, numberOfQuestions } = params;
    let questions: QuizQuestion[] = [];
    
    // Try to get questions for the specific topic
    const topicQuestions = this.mockQuestions[topic];
    
    if (topicQuestions && topicQuestions.length > 0) {
      // Convert the partial questions to full questions with IDs
      questions = topicQuestions.map(q => {
        // Generate IDs for options if they don't have them
        const options = q.options?.map((opt, index) => ({
          id: opt.id || index.toString(),
          text: opt.text
        })) || [];
        
        return {
          id: uuidv4(),
          question: q.question || "",
          options,
          correctOption: q.correctOption || "0",
          explanation: q.explanation
        };
      });
    } else {
      // If we don't have questions for this topic, generate generic ones
      questions = this.generateGenericQuestions(params);
    }
    
    // Limit to the requested number of questions
    return questions.slice(0, numberOfQuestions);
  }

  // Generate generic questions if we don't have specific ones
  private static generateGenericQuestions(params: QuizParameters): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    
    const topics = {
      domain: params.domain.replace('_', ' '),
      subject: params.subject.replace('_', ' '),
      topic: params.topic.replace('_', ' ')
    };
    
    // Generate the requested number of questions
    for (let i = 0; i < params.numberOfQuestions; i++) {
      questions.push({
        id: uuidv4(),
        question: `Sample question ${i + 1} about ${topics.topic} in ${topics.subject}?`,
        options: [
          { id: "0", text: `Option A for question ${i + 1}` },
          { id: "1", text: `Option B for question ${i + 1}` },
          { id: "2", text: `Option C for question ${i + 1}` },
          { id: "3", text: `Option D for question ${i + 1}` }
        ],
        correctOption: Math.floor(Math.random() * 4).toString()
      });
    }
    
    return questions;
  }
}

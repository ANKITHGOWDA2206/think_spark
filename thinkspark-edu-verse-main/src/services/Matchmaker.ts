
import { v4 as uuidv4 } from 'uuid';

export interface Opponent {
  id: string;
  name: string;
  type: 'ai' | 'human';
  skillLevel: number;  // 1-10
  avatar?: string;
}

export interface MatchResult {
  opponent: Opponent;
  matchId: string;
}

// This is a simple matchmaker service that would normally handle pairing with real players
// For now, it just creates AI opponents
export class Matchmaker {
  private static aiNames = [
    "QuizBot",
    "BrainiacAI",
    "SmartAlec",
    "IntelliQuiz",
    "ThinkTank",
    "MindMaster",
    "EinsteinAI",
    "OmniBot",
    "ScholarBot",
    "KnowledgeKeeper"
  ];
  
  // Find or create an opponent based on parameters
  public static async findOpponent(opponentType: string, difficulty: string): Promise<MatchResult> {
    // In a real implementation, this would connect to a matchmaking service
    // For now, we'll just create an AI opponent
    return new Promise((resolve) => {
      setTimeout(() => {
        const opponent = this.createAiOpponent(difficulty);
        
        resolve({
          opponent,
          matchId: uuidv4()
        });
      }, 1000); // Simulate network delay
    });
  }
  
  // Create an AI opponent with a skill level based on difficulty
  private static createAiOpponent(difficulty: string): Opponent {
    // Map difficulty to skill level
    let skillLevel = 5; // Default to medium
    
    switch (difficulty) {
      case 'easy':
        skillLevel = Math.floor(Math.random() * 3) + 3; // 3-5
        break;
      case 'medium':
        skillLevel = Math.floor(Math.random() * 3) + 5; // 5-7
        break;
      case 'hard':
        skillLevel = Math.floor(Math.random() * 3) + 7; // 7-9
        break;
    }
    
    // Pick a random AI name
    const name = this.aiNames[Math.floor(Math.random() * this.aiNames.length)];
    
    return {
      id: uuidv4(),
      name,
      type: 'ai',
      skillLevel
    };
  }
}

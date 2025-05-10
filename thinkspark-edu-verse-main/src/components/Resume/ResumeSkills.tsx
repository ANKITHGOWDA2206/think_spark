
import React, { useState } from 'react';
import { useResumeStore } from '@/services/ResumeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

const ResumeSkills: React.FC = () => {
  const { currentResume, updateResume } = useResumeStore();
  const [newSkill, setNewSkill] = useState('');
  
  if (!currentResume) return null;
  
  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    updateResume({
      ...currentResume,
      skills: [...currentResume.skills, newSkill.trim()]
    });
    
    setNewSkill('');
  };
  
  const removeSkill = (index: number) => {
    updateResume({
      ...currentResume,
      skills: currentResume.skills.filter((_, i) => i !== index)
    });
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Add a skill (e.g., JavaScript, Project Management)"
          className="flex-1"
        />
        <Button onClick={addSkill} disabled={!newSkill.trim()}>Add</Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {currentResume.skills.length === 0 ? (
          <p className="text-gray-500 w-full text-center py-4">
            No skills added yet. Enter skills above to add them to your resume.
          </p>
        ) : (
          currentResume.skills.map((skill, index) => (
            <div 
              key={index}
              className="bg-primary/10 text-primary rounded-full px-3 py-1 flex items-center"
            >
              {skill}
              <button 
                onClick={() => removeSkill(index)}
                className="ml-2 text-primary hover:text-primary/70 focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResumeSkills;

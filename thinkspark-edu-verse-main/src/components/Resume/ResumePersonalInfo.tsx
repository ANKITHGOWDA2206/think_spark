
import React from 'react';
import { useResumeStore } from '@/services/ResumeService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ResumePersonalInfo: React.FC = () => {
  const { currentResume, updateResume } = useResumeStore();
  
  if (!currentResume) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateResume({
      ...currentResume,
      [name]: value
    });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name"
          name="name"
          value={currentResume.name}
          onChange={handleChange}
          placeholder="John Doe"
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          name="email"
          type="email"
          value={currentResume.email}
          onChange={handleChange}
          placeholder="john.doe@example.com"
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input 
          id="phone"
          name="phone"
          value={currentResume.phone}
          onChange={handleChange}
          placeholder="+1 (123) 456-7890"
        />
      </div>
      
      <div>
        <Label htmlFor="objective">Career Objective</Label>
        <Textarea 
          id="objective"
          name="objective"
          value={currentResume.objective}
          onChange={handleChange}
          placeholder="Briefly describe your career goals and what you're looking for"
          rows={4}
        />
      </div>
    </div>
  );
};

export default ResumePersonalInfo;

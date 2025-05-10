
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CareerPath } from '@/services/CareerSuggestor';

interface ResumePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (career: CareerPath) => void;
  careers: CareerPath[];
}

const ResumePromptModal: React.FC<ResumePromptModalProps> = ({ isOpen, onClose, onConfirm, careers }) => {
  if (careers.length === 0) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Career Suggestion</DialogTitle>
          <DialogDescription>
            Based on your recent interactions, we've identified some potential career paths that might interest you.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {careers.map((career) => (
            <div key={career.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onConfirm(career)}>
              <h3 className="font-medium text-lg">{career.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{career.description}</p>
              <div className="flex flex-wrap gap-1">
                {career.skills.slice(0, 5).map((skill, index) => (
                  <span key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">{skill}</span>
                ))}
                {career.skills.length > 5 && (
                  <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">+{career.skills.length - 5} more</span>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={(e) => {
                  e.stopPropagation();
                  onConfirm(career);
                }}>
                  Build Resume
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Not Interested
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResumePromptModal;

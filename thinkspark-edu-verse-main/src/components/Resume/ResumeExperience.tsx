
import React from 'react';
import { useResumeStore } from '@/services/ResumeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const ResumeExperience: React.FC = () => {
  const { currentResume, updateResume } = useResumeStore();
  
  if (!currentResume) return null;
  
  const addExperience = () => {
    updateResume({
      ...currentResume,
      experience: [
        ...currentResume.experience,
        {
          id: uuidv4(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]
    });
  };
  
  const removeExperience = (id: string) => {
    updateResume({
      ...currentResume,
      experience: currentResume.experience.filter(exp => exp.id !== id)
    });
  };
  
  const updateExperience = (id: string, field: string, value: string) => {
    updateResume({
      ...currentResume,
      experience: currentResume.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };
  
  return (
    <div className="space-y-4">
      {currentResume.experience.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No work experience entries yet</p>
          <Button onClick={addExperience} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>
      ) : (
        <>
          {currentResume.experience.map((exp) => (
            <Card key={exp.id} className="border">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`company-${exp.id}`}>Company</Label>
                      <Input
                        id={`company-${exp.id}`}
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="Company Name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`position-${exp.id}`}>Position</Label>
                      <Input
                        id={`position-${exp.id}`}
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        placeholder="Job Title"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                      <Input
                        id={`startDate-${exp.id}`}
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        placeholder="MM/YYYY"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                      <Input
                        id={`endDate-${exp.id}`}
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        placeholder="MM/YYYY or Present"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`description-${exp.id}`}>Description</Label>
                    <Textarea
                      id={`description-${exp.id}`}
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end border-t pt-4">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => removeExperience(exp.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          <div className="flex justify-center">
            <Button variant="outline" onClick={addExperience}>
              <Plus className="h-4 w-4 mr-2" />
              Add Another Experience
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ResumeExperience;

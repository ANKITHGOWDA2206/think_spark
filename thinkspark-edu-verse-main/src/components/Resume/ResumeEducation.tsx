
import React, { useState } from 'react';
import { useResumeStore } from '@/services/ResumeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const ResumeEducation: React.FC = () => {
  const { currentResume, updateResume } = useResumeStore();
  
  if (!currentResume) return null;
  
  const addEducation = () => {
    updateResume({
      ...currentResume,
      education: [
        ...currentResume.education,
        {
          id: uuidv4(),
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: ''
        }
      ]
    });
  };
  
  const removeEducation = (id: string) => {
    updateResume({
      ...currentResume,
      education: currentResume.education.filter(edu => edu.id !== id)
    });
  };
  
  const updateEducation = (id: string, field: string, value: string) => {
    updateResume({
      ...currentResume,
      education: currentResume.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };
  
  return (
    <div className="space-y-4">
      {currentResume.education.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No education entries yet</p>
          <Button onClick={addEducation} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>
      ) : (
        <>
          {currentResume.education.map((edu) => (
            <Card key={edu.id} className="border">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                    <Input
                      id={`institution-${edu.id}`}
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      placeholder="University Name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                    <Input
                      id={`degree-${edu.id}`}
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="Bachelor's, Master's, etc."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                    <Input
                      id={`field-${edu.id}`}
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                      placeholder="Computer Science, Business, etc."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`startDate-${edu.id}`}>Start Date</Label>
                      <Input
                        id={`startDate-${edu.id}`}
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                        placeholder="MM/YYYY"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`endDate-${edu.id}`}>End Date</Label>
                      <Input
                        id={`endDate-${edu.id}`}
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                        placeholder="MM/YYYY or Present"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end border-t pt-4">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => removeEducation(edu.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          <div className="flex justify-center">
            <Button variant="outline" onClick={addEducation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Another Education
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ResumeEducation;

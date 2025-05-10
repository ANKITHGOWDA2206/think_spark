
import React from 'react';
import { useResumeStore } from '@/services/ResumeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const ResumeCertifications: React.FC = () => {
  const { currentResume, updateResume } = useResumeStore();
  
  if (!currentResume) return null;
  
  const addCertification = () => {
    updateResume({
      ...currentResume,
      certifications: [
        ...currentResume.certifications,
        {
          id: uuidv4(),
          name: '',
          issuer: '',
          date: ''
        }
      ]
    });
  };
  
  const removeCertification = (id: string) => {
    updateResume({
      ...currentResume,
      certifications: currentResume.certifications.filter(cert => cert.id !== id)
    });
  };
  
  const updateCertification = (id: string, field: string, value: string) => {
    updateResume({
      ...currentResume,
      certifications: currentResume.certifications.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    });
  };
  
  return (
    <div className="space-y-4">
      {currentResume.certifications.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No certifications added yet</p>
          <Button onClick={addCertification} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </div>
      ) : (
        <>
          {currentResume.certifications.map((cert) => (
            <Card key={cert.id} className="border">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor={`name-${cert.id}`}>Certification Name</Label>
                    <Input
                      id={`name-${cert.id}`}
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                      placeholder="e.g., AWS Certified Solutions Architect"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`issuer-${cert.id}`}>Issuing Organization</Label>
                    <Input
                      id={`issuer-${cert.id}`}
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                      placeholder="e.g., Amazon Web Services"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`date-${cert.id}`}>Date</Label>
                    <Input
                      id={`date-${cert.id}`}
                      value={cert.date}
                      onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                      placeholder="MM/YYYY"
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end border-t pt-4">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => removeCertification(cert.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          <div className="flex justify-center">
            <Button variant="outline" onClick={addCertification}>
              <Plus className="h-4 w-4 mr-2" />
              Add Another Certification
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ResumeCertifications;

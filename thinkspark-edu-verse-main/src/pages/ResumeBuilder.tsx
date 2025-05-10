
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useResumeStore } from '@/services/ResumeService';
import ResumePersonalInfo from '@/components/Resume/ResumePersonalInfo';
import ResumeEducation from '@/components/Resume/ResumeEducation';
import ResumeExperience from '@/components/Resume/ResumeExperience';
import ResumeSkills from '@/components/Resume/ResumeSkills';
import ResumeProjects from '@/components/Resume/ResumeProjects';
import ResumeCertifications from '@/components/Resume/ResumeCertifications';
import ResumePreview from '@/components/Resume/ResumePreview';

const ResumeBuilder: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  
  const { 
    currentResume, 
    createResume, 
    getResume, 
    updateResume, 
    deleteResume,
    setCurrentResume
  } = useResumeStore();
  
  // Load resume if ID is provided or use current resume
  React.useEffect(() => {
    if (resumeId) {
      const resume = getResume(resumeId);
      if (resume) {
        setCurrentResume(resume);
      } else {
        toast({
          title: "Resume not found",
          description: "The resume you're looking for couldn't be found.",
          variant: "destructive",
        });
        navigate('/career-advisor');
      }
    } else if (!currentResume) {
      // Create new resume if none exists
      createResume();
    }
  }, [resumeId, getResume, setCurrentResume, navigate, toast, createResume, currentResume]);
  
  // If still loading resume
  if (!currentResume) {
    return <div className="py-8 text-center">Loading resume...</div>;
  }
  
  const handleSave = () => {
    updateResume(currentResume);
    toast({
      title: "Resume saved",
      description: "Your resume has been saved successfully.",
    });
  };
  
  const handleDelete = () => {
    deleteResume(currentResume.id);
    toast({
      title: "Resume deleted",
      description: "Your resume has been deleted.",
    });
    navigate('/career-advisor');
  };
  
  const handleExport = () => {
    // In a real implementation, this would generate a PDF
    // For now, we'll just show a toast
    toast({
      title: "Resume exported",
      description: "Your resume has been exported as a PDF.",
    });
  };
  
  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate('/career-advisor')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-6">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="certifications">Certifications</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="mt-4">
                  <ResumePersonalInfo />
                </TabsContent>
                
                <TabsContent value="education" className="mt-4">
                  <ResumeEducation />
                </TabsContent>
                
                <TabsContent value="experience" className="mt-4">
                  <ResumeExperience />
                </TabsContent>
                
                <TabsContent value="skills" className="mt-4">
                  <ResumeSkills />
                </TabsContent>
                
                <TabsContent value="projects" className="mt-4">
                  <ResumeProjects />
                </TabsContent>
                
                <TabsContent value="certifications" className="mt-4">
                  <ResumeCertifications />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <ResumePreview resume={currentResume} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;

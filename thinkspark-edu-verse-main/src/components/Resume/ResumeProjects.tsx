
import React, { useState } from 'react';
import { useResumeStore } from '@/services/ResumeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Trash2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const ResumeProjects: React.FC = () => {
  const { currentResume, updateResume } = useResumeStore();
  const [newTech, setNewTech] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  if (!currentResume) return null;
  
  const addProject = () => {
    const newProject = {
      id: uuidv4(),
      name: '',
      description: '',
      technologies: []
    };
    
    updateResume({
      ...currentResume,
      projects: [...currentResume.projects, newProject]
    });
    
    // Set this as the editing project
    setEditingProjectId(newProject.id);
  };
  
  const removeProject = (id: string) => {
    updateResume({
      ...currentResume,
      projects: currentResume.projects.filter(project => project.id !== id)
    });
    
    if (editingProjectId === id) {
      setEditingProjectId(null);
    }
  };
  
  const updateProject = (id: string, field: string, value: any) => {
    updateResume({
      ...currentResume,
      projects: currentResume.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    });
  };
  
  const addTechnology = (projectId: string) => {
    if (!newTech.trim()) return;
    
    const project = currentResume.projects.find(p => p.id === projectId);
    
    if (project) {
      updateProject(projectId, 'technologies', [...project.technologies, newTech.trim()]);
      setNewTech('');
    }
  };
  
  const removeTechnology = (projectId: string, techIndex: number) => {
    const project = currentResume.projects.find(p => p.id === projectId);
    
    if (project) {
      updateProject(
        projectId, 
        'technologies', 
        project.technologies.filter((_, i) => i !== techIndex)
      );
    }
  };
  
  const handleTechKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, projectId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology(projectId);
    }
  };
  
  return (
    <div className="space-y-4">
      {currentResume.projects.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No projects added yet</p>
          <Button onClick={addProject} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      ) : (
        <>
          {currentResume.projects.map((project) => (
            <Card key={project.id} className="border">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor={`name-${project.id}`}>Project Name</Label>
                    <Input
                      id={`name-${project.id}`}
                      value={project.name}
                      onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                      placeholder="Project Name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`description-${project.id}`}>Description</Label>
                    <Textarea
                      id={`description-${project.id}`}
                      value={project.description}
                      onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                      placeholder="Describe the project, your role, and achievements"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`technologies-${project.id}`}>Technologies Used</Label>
                    {editingProjectId === project.id ? (
                      <div className="flex items-center space-x-2 mb-2">
                        <Input
                          id={`technologies-${project.id}`}
                          value={newTech}
                          onChange={(e) => setNewTech(e.target.value)}
                          onKeyDown={(e) => handleTechKeyPress(e, project.id)}
                          placeholder="Add a technology (e.g., React, Node.js)"
                          className="flex-1"
                        />
                        <Button 
                          onClick={() => addTechnology(project.id)} 
                          disabled={!newTech.trim()}
                        >
                          Add
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full mb-2"
                        onClick={() => setEditingProjectId(project.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Technologies
                      </Button>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <div 
                          key={index}
                          className="bg-primary/10 text-primary rounded-full px-3 py-1 flex items-center"
                        >
                          {tech}
                          <button 
                            onClick={() => removeTechnology(project.id, index)}
                            className="ml-2 text-primary hover:text-primary/70 focus:outline-none"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      
                      {project.technologies.length === 0 && editingProjectId === project.id && (
                        <p className="text-gray-500 text-sm">
                          No technologies added yet. Enter technologies above.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-4">
                {editingProjectId === project.id ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditingProjectId(null)}
                  >
                    Done Editing
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditingProjectId(project.id)}
                  >
                    Edit Technologies
                  </Button>
                )}
                
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => removeProject(project.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Project
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          <div className="flex justify-center">
            <Button variant="outline" onClick={addProject}>
              <Plus className="h-4 w-4 mr-2" />
              Add Another Project
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ResumeProjects;

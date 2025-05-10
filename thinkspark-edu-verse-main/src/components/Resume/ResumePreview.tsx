
import React from 'react';
import { Resume } from '@/services/ResumeService';
import { Card } from '@/components/ui/card';

interface ResumePreviewProps {
  resume: Resume;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume }) => {
  return (
    <Card className="border p-6 shadow-lg bg-white max-h-[800px] overflow-y-auto">
      <div className="space-y-6 text-sm">
        {/* Header */}
        <div className="text-center pb-4 border-b">
          <h1 className="text-2xl font-bold">{resume.name || "Your Name"}</h1>
          <div className="text-muted-foreground mt-2">
            {(resume.email || resume.phone) ? (
              <>
                {resume.email && <p>{resume.email}</p>}
                {resume.phone && <p>{resume.phone}</p>}
              </>
            ) : (
              <p className="italic text-gray-400">Add contact information</p>
            )}
          </div>
        </div>
        
        {/* Objective */}
        {resume.objective && (
          <div>
            <h2 className="text-lg font-bold border-b pb-1 mb-2">Career Objective</h2>
            <p>{resume.objective}</p>
          </div>
        )}
        
        {/* Education */}
        {resume.education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold border-b pb-1 mb-2">Education</h2>
            <div className="space-y-3">
              {resume.education.map((edu) => (
                <div key={edu.id} className="ml-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">{edu.institution || "Institution"}</h3>
                    <p className="text-xs text-muted-foreground">
                      {edu.startDate && edu.endDate ? 
                        `${edu.startDate} - ${edu.endDate}` :
                        edu.startDate || edu.endDate || "Date range"}
                    </p>
                  </div>
                  <p>{edu.degree} {edu.field ? `in ${edu.field}` : ""}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Experience */}
        {resume.experience.length > 0 && (
          <div>
            <h2 className="text-lg font-bold border-b pb-1 mb-2">Work Experience</h2>
            <div className="space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="ml-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">{exp.position || "Position"} {exp.company ? `at ${exp.company}` : ""}</h3>
                    <p className="text-xs text-muted-foreground">
                      {exp.startDate && exp.endDate ? 
                        `${exp.startDate} - ${exp.endDate}` :
                        exp.startDate || exp.endDate || "Date range"}
                    </p>
                  </div>
                  {exp.description && <p className="mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Skills */}
        {resume.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold border-b pb-1 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {resume.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Projects */}
        {resume.projects.length > 0 && (
          <div>
            <h2 className="text-lg font-bold border-b pb-1 mb-2">Projects</h2>
            <div className="space-y-4">
              {resume.projects.map((project) => (
                <div key={project.id} className="ml-1">
                  <h3 className="font-semibold">{project.name || "Project Name"}</h3>
                  {project.description && <p className="mt-1">{project.description}</p>}
                  
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech, i) => (
                        <span 
                          key={i} 
                          className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Certifications */}
        {resume.certifications.length > 0 && (
          <div>
            <h2 className="text-lg font-bold border-b pb-1 mb-2">Certifications</h2>
            <div className="space-y-2">
              {resume.certifications.map((cert) => (
                <div key={cert.id} className="ml-1">
                  <div className="flex justify-between items-baseline">
                    <p><span className="font-semibold">{cert.name || "Certification Name"}</span> {cert.issuer ? `- ${cert.issuer}` : ""}</p>
                    {cert.date && <span className="text-xs text-muted-foreground">{cert.date}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {!resume.name && !resume.email && !resume.phone && !resume.objective && 
         resume.education.length === 0 && resume.experience.length === 0 && 
         resume.skills.length === 0 && resume.projects.length === 0 && 
         resume.certifications.length === 0 && (
          <div className="text-center py-12 text-muted-foreground italic">
            Start filling out the form to see your resume preview here
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResumePreview;

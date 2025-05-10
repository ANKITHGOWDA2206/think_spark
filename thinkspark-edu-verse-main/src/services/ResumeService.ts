
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { CareerPath } from './CareerSuggestor';

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  objective: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  createdAt: string;
  updatedAt: string;
  careerPath?: CareerPath;
}

interface ResumeState {
  resumes: Record<string, Resume>;
  currentResume: Resume | null;
  setCurrentResume: (resume: Resume | null) => void;
  createResume: (careerPath?: CareerPath) => Resume;
  updateResume: (resume: Resume) => void;
  deleteResume: (id: string) => void;
  getResume: (id: string) => Resume | undefined;
  getAllResumes: () => Resume[];
}

const emptyResume = (): Resume => ({
  id: uuidv4(),
  name: '',
  email: '',
  phone: '',
  objective: '',
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumes: {},
      currentResume: null,
      setCurrentResume: (resume) => set({ currentResume: resume }),
      createResume: (careerPath) => {
        const newResume = {
          ...emptyResume(),
          careerPath,
          objective: careerPath ? 
            `Seeking a position as a ${careerPath.title} to leverage my skills in ${careerPath.skills.slice(0, 3).join(', ')}` : 
            '',
          skills: careerPath ? [...careerPath.skills] : []
        };
        
        set((state) => ({
          resumes: {
            ...state.resumes,
            [newResume.id]: newResume
          },
          currentResume: newResume
        }));
        
        return newResume;
      },
      updateResume: (resume) => {
        const updatedResume = {
          ...resume,
          updatedAt: new Date().toISOString()
        };
        
        set((state) => ({
          resumes: {
            ...state.resumes,
            [updatedResume.id]: updatedResume
          },
          currentResume: updatedResume
        }));
      },
      deleteResume: (id) => set((state) => {
        const { [id]: _, ...remainingResumes } = state.resumes;
        return { 
          resumes: remainingResumes,
          currentResume: state.currentResume?.id === id ? null : state.currentResume
        };
      }),
      getResume: (id) => get().resumes[id],
      getAllResumes: () => Object.values(get().resumes).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    }),
    {
      name: 'resume-storage'
    }
  )
);

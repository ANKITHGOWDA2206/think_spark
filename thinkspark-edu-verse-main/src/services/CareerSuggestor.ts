
import { v4 as uuidv4 } from 'uuid';

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  skills: string[];
  education: string[];
  jobTitles: string[];
}

// Map of keywords to career domains
const keywordToDomain: Record<string, string[]> = {
  'ai': ['artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'data science'],
  'web': ['frontend', 'backend', 'fullstack', 'javascript', 'react', 'node', 'html', 'css'],
  'data': ['data science', 'analytics', 'visualization', 'statistics', 'dashboard', 'reporting'],
  'security': ['cybersecurity', 'network security', 'penetration testing', 'security audit', 'cryptography'],
  'cloud': ['aws', 'azure', 'gcp', 'serverless', 'infrastructure', 'devops'],
  'mobile': ['android', 'ios', 'react native', 'flutter', 'mobile development'],
  'game': ['unity', 'unreal', 'game development', '3d modeling', 'animation'],
};

// Career paths database
const careerPaths: Record<string, CareerPath[]> = {
  'ai': [
    {
      id: uuidv4(),
      title: 'AI Engineer',
      description: 'Design and implement AI models and systems to solve complex problems.',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'Neural Networks', 'Computer Vision', 'NLP'],
      education: ['BS/MS in Computer Science', 'AI/ML Specialization', 'Online Courses in Deep Learning'],
      jobTitles: ['AI Engineer', 'Machine Learning Engineer', 'Deep Learning Specialist']
    },
    {
      id: uuidv4(),
      title: 'Data Scientist',
      description: 'Analyze complex data to extract insights and build predictive models.',
      skills: ['Python', 'R', 'SQL', 'Statistics', 'Machine Learning', 'Data Visualization'],
      education: ['BS/MS in Statistics/Math/CS', 'Data Science Bootcamp', 'Online Specializations'],
      jobTitles: ['Data Scientist', 'ML Researcher', 'Quantitative Analyst']
    }
  ],
  'web': [
    {
      id: uuidv4(),
      title: 'Frontend Developer',
      description: 'Build interactive user interfaces and web applications.',
      skills: ['JavaScript', 'React', 'Vue', 'Angular', 'HTML', 'CSS', 'Responsive Design'],
      education: ['BS in CS/Web Development', 'Frontend Bootcamp', 'Online Courses'],
      jobTitles: ['Frontend Developer', 'UI Engineer', 'Web Developer']
    },
    {
      id: uuidv4(),
      title: 'Backend Developer',
      description: 'Build server-side logic, databases, and APIs.',
      skills: ['Node.js', 'Python', 'Java', 'Go', 'SQL', 'NoSQL', 'RESTful APIs'],
      education: ['BS in CS/Software Engineering', 'Backend Development Courses'],
      jobTitles: ['Backend Developer', 'API Developer', 'Software Engineer']
    }
  ],
  'data': [
    {
      id: uuidv4(),
      title: 'Data Analyst',
      description: 'Interpret data and provide actionable insights for business decisions.',
      skills: ['SQL', 'Excel', 'Tableau/Power BI', 'Python/R', 'Statistics'],
      education: ['BS in Analytics/Statistics/Economics', 'Data Analysis Certification'],
      jobTitles: ['Data Analyst', 'Business Intelligence Analyst', 'Data Visualization Specialist']
    }
  ],
  'security': [
    {
      id: uuidv4(),
      title: 'Cybersecurity Analyst',
      description: 'Protect systems and networks from digital attacks and security breaches.',
      skills: ['Network Security', 'Vulnerability Assessment', 'Security Tools', 'Incident Response'],
      education: ['BS in Cybersecurity/IT', 'Security Certifications (CISSP, CEH)'],
      jobTitles: ['Security Analyst', 'Security Engineer', 'Penetration Tester']
    }
  ],
  'cloud': [
    {
      id: uuidv4(),
      title: 'Cloud Architect',
      description: 'Design and implement cloud infrastructure solutions.',
      skills: ['AWS/Azure/GCP', 'Infrastructure as Code', 'Containerization', 'Networking'],
      education: ['BS in CS/IT', 'Cloud Certifications (AWS, Azure)', 'DevOps Training'],
      jobTitles: ['Cloud Architect', 'DevOps Engineer', 'Cloud Engineer']
    }
  ],
  'mobile': [
    {
      id: uuidv4(),
      title: 'Mobile Developer',
      description: 'Create applications for mobile devices.',
      skills: ['Swift/Kotlin', 'React Native', 'Flutter', 'Mobile UI Design'],
      education: ['BS in CS/Mobile Dev', 'Mobile Development Bootcamp'],
      jobTitles: ['iOS Developer', 'Android Developer', 'Mobile App Developer']
    }
  ],
  'game': [
    {
      id: uuidv4(),
      title: 'Game Developer',
      description: 'Design and program video games for various platforms.',
      skills: ['Unity/Unreal Engine', 'C#/C++', '3D Modeling', 'Game Physics'],
      education: ['BS in Game Development/CS', 'Game Design Courses'],
      jobTitles: ['Game Developer', 'Game Designer', 'Game Programmer']
    }
  ]
};

export class CareerSuggestor {
  static analyzeUserQueries(queries: string[]): string[] {
    if (!queries || queries.length === 0) {
      return [];
    }
    
    // Convert all queries to lowercase and join them
    const combinedQuery = queries.join(' ').toLowerCase();
    
    // Count occurrences of keywords in each domain
    const domainScores: Record<string, number> = {};
    
    for (const [domain, keywords] of Object.entries(keywordToDomain)) {
      domainScores[domain] = keywords.reduce((score, keyword) => {
        const regex = new RegExp(keyword, 'gi');
        const matches = combinedQuery.match(regex);
        return score + (matches ? matches.length : 0);
      }, 0);
    }
    
    // Sort domains by score and return the top 2 (if they have any matches)
    return Object.entries(domainScores)
      .filter(([_, score]) => score > 0)
      .sort(([_, scoreA], [__, scoreB]) => scoreB - scoreA)
      .slice(0, 2)
      .map(([domain]) => domain);
  }
  
  static suggestCareers(domains: string[]): CareerPath[] {
    if (!domains || domains.length === 0) {
      // Return a default career if no domains match
      return careerPaths['web'].slice(0, 1);
    }
    
    // Get careers from the matched domains (max 2 careers)
    const suggestions: CareerPath[] = [];
    
    for (const domain of domains) {
      if (careerPaths[domain]) {
        // Take one career from each domain
        suggestions.push(careerPaths[domain][0]);
        
        // Limit to 2 total careers
        if (suggestions.length >= 2) break;
      }
    }
    
    return suggestions.length > 0 ? suggestions : careerPaths['web'].slice(0, 1);
  }
}

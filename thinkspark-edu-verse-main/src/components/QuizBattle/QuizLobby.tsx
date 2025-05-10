import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { BookOpen, Trophy, User, Users, Clock } from 'lucide-react';
import { useQuizState } from '@/hooks/useQuizState';

// Predefined quiz topics
const QUIZ_DOMAINS = [
  { id: 'ai', name: 'Artificial Intelligence' },
  { id: 'cs', name: 'Computer Science' },
  { id: 'math', name: 'Mathematics' },
  { id: 'science', name: 'Science' },
  { id: 'web_dev', name: 'Web Development' },
  { id: 'cybersecurity', name: 'Cybersecurity' },
];

const QUIZ_SUBJECTS = {
  ai: [
    { id: 'deep_learning', name: 'Deep Learning' },
    { id: 'nlp', name: 'Natural Language Processing' },
    { id: 'ml', name: 'Machine Learning' },
    { id: 'computer_vision', name: 'Computer Vision' },
  ],
  cs: [
    { id: 'os', name: 'Operating Systems' },
    { id: 'algorithms', name: 'Algorithms' },
    { id: 'db', name: 'Databases' },
    { id: 'data_structures', name: 'Data Structures' },
    { id: 'networking', name: 'Computer Networks' },
    { id: 'software_engineering', name: 'Software Engineering' },
    { id: 'distributed_systems', name: 'Distributed Systems' },
    { id: 'cloud_computing', name: 'Cloud Computing' },
  ],
  math: [
    { id: 'calculus', name: 'Calculus' },
    { id: 'algebra', name: 'Algebra' },
    { id: 'statistics', name: 'Statistics' },
    { id: 'discrete_math', name: 'Discrete Mathematics' },
  ],
  science: [
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
  ],
  web_dev: [
    { id: 'frontend', name: 'Frontend Development' },
    { id: 'backend', name: 'Backend Development' },
    { id: 'fullstack', name: 'Full Stack Development' },
    { id: 'web_frameworks', name: 'Web Frameworks' },
  ],
  cybersecurity: [
    { id: 'network_security', name: 'Network Security' },
    { id: 'cryptography', name: 'Cryptography' },
    { id: 'security_practices', name: 'Security Practices' },
    { id: 'ethical_hacking', name: 'Ethical Hacking' },
  ],
};

const QUIZ_TOPICS = {
  deep_learning: [
    { id: 'cnn', name: 'Convolutional Neural Networks' },
    { id: 'rnn', name: 'Recurrent Neural Networks' },
  ],
  nlp: [
    { id: 'transformers', name: 'Transformers' },
    { id: 'word_embeddings', name: 'Word Embeddings' },
  ],
  ml: [
    { id: 'supervised', name: 'Supervised Learning' },
    { id: 'unsupervised', name: 'Unsupervised Learning' },
  ],
  os: [
    { id: 'memory_management', name: 'Memory Management' },
    { id: 'process_scheduling', name: 'Process Scheduling' },
    { id: 'file_systems', name: 'File Systems' },
    { id: 'virtualization', name: 'Virtualization' },
  ],
  algorithms: [
    { id: 'sorting', name: 'Sorting Algorithms' },
    { id: 'graph', name: 'Graph Algorithms' },
    { id: 'dynamic_programming', name: 'Dynamic Programming' },
    { id: 'greedy', name: 'Greedy Algorithms' },
  ],
  db: [
    { id: 'sql', name: 'SQL' },
    { id: 'nosql', name: 'NoSQL' },
    { id: 'database_design', name: 'Database Design' },
    { id: 'query_optimization', name: 'Query Optimization' },
  ],
  data_structures: [
    { id: 'arrays', name: 'Arrays & Lists' },
    { id: 'trees', name: 'Trees' },
    { id: 'graphs', name: 'Graphs' },
    { id: 'hash_tables', name: 'Hash Tables' },
  ],
  networking: [
    { id: 'protocols', name: 'Network Protocols' },
    { id: 'routing', name: 'Routing' },
    { id: 'network_security', name: 'Network Security' },
    { id: 'socket_programming', name: 'Socket Programming' },
  ],
  software_engineering: [
    { id: 'design_patterns', name: 'Design Patterns' },
    { id: 'agile', name: 'Agile Methodologies' },
    { id: 'testing', name: 'Software Testing' },
    { id: 'version_control', name: 'Version Control' },
  ],
  distributed_systems: [
    { id: 'consensus', name: 'Consensus Algorithms' },
    { id: 'replication', name: 'Replication Strategies' },
    { id: 'fault_tolerance', name: 'Fault Tolerance' },
    { id: 'distributed_computing', name: 'Distributed Computing Models' },
  ],
  cloud_computing: [
    { id: 'iaas', name: 'Infrastructure as a Service' },
    { id: 'paas', name: 'Platform as a Service' },
    { id: 'saas', name: 'Software as a Service' },
    { id: 'serverless', name: 'Serverless Computing' },
  ],
  frontend: [
    { id: 'html_css', name: 'HTML & CSS' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'react', name: 'React' },
    { id: 'responsive_design', name: 'Responsive Design' },
  ],
  backend: [
    { id: 'node_js', name: 'Node.js' },
    { id: 'rest_apis', name: 'REST APIs' },
    { id: 'authentication', name: 'Authentication & Authorization' },
    { id: 'server_architecture', name: 'Server Architecture' },
  ],
  network_security: [
    { id: 'firewalls', name: 'Firewalls' },
    { id: 'ids_ips', name: 'Intrusion Detection & Prevention' },
    { id: 'vpn', name: 'VPN & Secure Communication' },
    { id: 'network_attacks', name: 'Network Attacks & Defense' },
  ],
  cryptography: [
    { id: 'encryption', name: 'Encryption Methods' },
    { id: 'hashing', name: 'Hashing Algorithms' },
    { id: 'digital_signatures', name: 'Digital Signatures' },
    { id: 'key_management', name: 'Key Management' },
  ],
  cnn: [
    { id: 'architecture', name: 'CNN Architectures' },
    { id: 'layers', name: 'CNN Layers' },
  ],
  rnn: [
    { id: 'lstm', name: 'LSTM Networks' },
    { id: 'gru', name: 'GRU Networks' },
  ],
  transformers: [
    { id: 'attention', name: 'Attention Mechanisms' },
    { id: 'bert', name: 'BERT' },
  ],
  word_embeddings: [
    { id: 'word2vec', name: 'Word2Vec' },
    { id: 'glove', name: 'GloVe' },
  ],
  supervised: [
    { id: 'regression', name: 'Regression' },
    { id: 'classification', name: 'Classification' },
  ],
  unsupervised: [
    { id: 'clustering', name: 'Clustering' },
    { id: 'dimensionality_reduction', name: 'Dimensionality Reduction' },
  ],
  calculus: [
    { id: 'limits', name: 'Limits' },
    { id: 'derivatives', name: 'Derivatives' },
  ],
  algebra: [
    { id: 'linear', name: 'Linear Algebra' },
    { id: 'polynomials', name: 'Polynomials' },
  ],
  statistics: [
    { id: 'probability', name: 'Probability' },
    { id: 'distributions', name: 'Distributions' },
  ],
  discrete_math: [
    { id: 'logic', name: 'Logic' },
    { id: 'graph_theory', name: 'Graph Theory' },
  ],
  physics: [
    { id: 'mechanics', name: 'Mechanics' },
    { id: 'thermodynamics', name: 'Thermodynamics' },
  ],
  chemistry: [
    { id: 'organic', name: 'Organic Chemistry' },
    { id: 'inorganic', name: 'Inorganic Chemistry' },
  ],
  biology: [
    { id: 'genetics', name: 'Genetics' },
    { id: 'ecology', name: 'Ecology' },
  ],
  fullstack: [
    { id: 'mern', name: 'MERN Stack' },
    { id: 'mean', name: 'MEAN Stack' },
  ],
  web_frameworks: [
    { id: 'angular', name: 'Angular' },
    { id: 'vue', name: 'Vue.js' },
  ],
  security_practices: [
    { id: 'penetration_testing', name: 'Penetration Testing' },
    { id: 'incident_response', name: 'Incident Response' },
  ],
  ethical_hacking: [
    { id: 'reconnaissance', name: 'Reconnaissance' },
    { id: 'exploitation', name: 'Exploitation' },
  ],
  iaas: [
    { id: 'aws', name: 'Amazon Web Services' },
    { id: 'azure', name: 'Microsoft Azure' },
  ],
  paas: [
    { id: 'heroku', name: 'Heroku' },
    { id: 'google_app_engine', name: 'Google App Engine' },
  ],
  saas: [
    { id: 'salesforce', name: 'Salesforce' },
    { id: 'dropbox', name: 'Dropbox' },
  ],
  serverless: [
    { id: 'aws_lambda', name: 'AWS Lambda' },
    { id: 'azure_functions', name: 'Azure Functions' },
  ],
  html_css: [
    { id: 'semantic_html', name: 'Semantic HTML' },
    { id: 'css_frameworks', name: 'CSS Frameworks' },
  ],
  javascript: [
    { id: 'es6', name: 'ES6+' },
    { id: 'dom_manipulation', name: 'DOM Manipulation' },
  ],
  react: [
    { id: 'hooks', name: 'React Hooks' },
    { id: 'redux', name: 'Redux' },
  ],
  responsive_design: [
    { id: 'media_queries', name: 'Media Queries' },
    { id: 'viewport', name: 'Viewport Settings' },
  ],
  node_js: [
    { id: 'express', name: 'Express.js' },
    { id: 'npm', name: 'NPM' },
  ],
  rest_apis: [
    { id: 'restful_principles', name: 'RESTful Principles' },
    { id: 'api_design', name: 'API Design' },
  ],
  authentication: [
    { id: 'jwt', name: 'JWT' },
    { id: 'oauth', name: 'OAuth' },
  ],
  server_architecture: [
    { id: 'microservices', name: 'Microservices' },
    { id: 'monolithic', name: 'Monolithic Architecture' },
  ],
  protocols: [
    { id: 'tcp_ip', name: 'TCP/IP' },
    { id: 'http_https', name: 'HTTP/HTTPS' },
  ],
  routing: [
    { id: 'bgp', name: 'BGP' },
    { id: 'ospf', name: 'OSPF' },
  ],
  socket_programming: [
    { id: 'tcp_sockets', name: 'TCP Sockets' },
    { id: 'udp_sockets', name: 'UDP Sockets' },
  ],
  design_patterns: [
    { id: 'singleton', name: 'Singleton' },
    { id: 'factory', name: 'Factory' },
  ],
  agile: [
    { id: 'scrum', name: 'Scrum' },
    { id: 'kanban', name: 'Kanban' },
  ],
  testing: [
    { id: 'unit_testing', name: 'Unit Testing' },
    { id: 'integration_testing', name: 'Integration Testing' },
  ],
  version_control: [
    { id: 'git', name: 'Git' },
    { id: 'github', name: 'GitHub' },
  ],
  consensus: [
    { id: 'paxos', name: 'Paxos' },
    { id: 'raft', name: 'Raft' },
  ],
  replication: [
    { id: 'master_slave', name: 'Master-Slave' },
    { id: 'multi_master', name: 'Multi-Master' },
  ],
  fault_tolerance: [
    { id: 'redundancy', name: 'Redundancy' },
    { id: 'failover', name: 'Failover' },
  ],
  distributed_computing: [
    { id: 'mapreduce', name: 'MapReduce' },
    { id: 'spark', name: 'Spark' },
  ],
};

// Difficulty settings with adjusted number of questions
const DIFFICULTIES = [
  { id: 'easy', name: 'Easy', questions: 5 },
  { id: 'medium', name: 'Medium', questions: 8 },
  { id: 'hard', name: 'Hard', questions: 12 },
  { id: 'expert', name: 'Expert', questions: 15 },
];

// Opponent types
const OPPONENT_TYPES = [
  { id: 'ai', name: 'AI Opponent', icon: <BookOpen className="h-5 w-5" /> },
  { id: 'friend', name: 'Friend (Coming Soon)', icon: <Users className="h-5 w-5" />, disabled: true },
];

const QuizLobby: React.FC = () => {
  const [domain, setDomain] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [opponentType, setOpponentType] = useState<string>('ai');
  const [loading, setLoading] = useState<boolean>(false);
  
  const { startQuiz } = useQuizState();
  
  const handleSubjectChange = (value: string) => {
    setSubject(value);
    setTopic('');
  };

  const handleDomainChange = (value: string) => {
    setDomain(value);
    setSubject('');
    setTopic('');
  };

  const handleStartQuiz = async () => {
    if (!domain || !subject || !topic || !difficulty) {
      return;
    }

    setLoading(true);
    
    const difficultyObject = DIFFICULTIES.find(d => d.id === difficulty);
    const numberOfQuestions = difficultyObject?.questions || 5;

    try {
      // In a real implementation, we'd fetch questions from an API
      await startQuiz({
        domain,
        subject,
        topic,
        difficulty,
        opponentType,
        numberOfQuestions,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quiz Battle Setup</CardTitle>
          <CardDescription>Configure your quiz battle settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Select Domain</label>
                <Select value={domain} onValueChange={handleDomainChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUIZ_DOMAINS.map(domainOption => (
                      <SelectItem key={domainOption.id} value={domainOption.id}>
                        {domainOption.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Select Subject</label>
                <Select 
                  value={subject} 
                  onValueChange={handleSubjectChange}
                  disabled={!domain}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={domain ? "Select a subject" : "Choose a domain first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {domain && QUIZ_SUBJECTS[domain as keyof typeof QUIZ_SUBJECTS]?.map(subjectOption => (
                      <SelectItem key={subjectOption.id} value={subjectOption.id}>
                        {subjectOption.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Select Topic</label>
                <Select 
                  value={topic} 
                  onValueChange={setTopic}
                  disabled={!subject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={subject ? "Select a topic" : "Choose a subject first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {subject && QUIZ_TOPICS[subject as keyof typeof QUIZ_TOPICS]?.map(topicOption => (
                      <SelectItem key={topicOption.id} value={topicOption.id}>
                        {topicOption.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Difficulty</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {DIFFICULTIES.map(diff => (
                    <Button
                      key={diff.id}
                      variant={difficulty === diff.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setDifficulty(diff.id)}
                    >
                      <div className="flex flex-col items-center text-center w-full">
                        <span>{diff.name}</span>
                        <span className="text-xs mt-1 text-muted-foreground">{diff.questions} questions</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Opponent</label>
                <div className="grid grid-cols-2 gap-4">
                  {OPPONENT_TYPES.map(opponent => (
                    <Button
                      key={opponent.id}
                      variant={opponentType === opponent.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => !opponent.disabled && setOpponentType(opponent.id)}
                      disabled={opponent.disabled}
                    >
                      <div className="flex items-center w-full">
                        {opponent.icon}
                        <span className="ml-2">{opponent.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleStartQuiz} 
            disabled={!domain || !subject || !topic || !difficulty || loading} 
            className="w-full"
          >
            {loading ? 'Loading Questions...' : 'Start Battle'}
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <Trophy className="h-8 w-8 text-accent mb-2" />
            <CardTitle className="text-lg">Various Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Test your knowledge across multiple subjects and domains.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <User className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Challenge AI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Compete against our adaptive AI opponent that matches your skill level.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <Clock className="h-8 w-8 text-secondary mb-2" />
            <CardTitle className="text-lg">Track Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">See your improvement over time with detailed statistics.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizLobby;

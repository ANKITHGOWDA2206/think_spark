
import React, { useState } from 'react';
import { Plus, Search, Filter, ThumbsUp, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';

const Innovation: React.FC = () => {
  const { ideas, user, addIdea } = useAppContext();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2070'
  });
  
  const handleSubmitIdea = () => {
    if (!newIdea.title || !newIdea.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (user) {
      addIdea({
        userId: user.id,
        title: newIdea.title,
        description: newIdea.description,
        imageUrl: newIdea.imageUrl
      });
      
      toast({
        title: "Success!",
        description: "Your innovative idea has been shared!",
      });
      
      // Reset form and close dialog
      setNewIdea({
        title: '',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2070'
      });
      setIsDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "You must be logged in to share ideas",
        variant: "destructive"
      });
    }
  };
  
  const filteredIdeas = ideas.filter(idea =>
    idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Innovation Hub</h1>
          <p className="text-gray-600">
            Share your innovative ideas and get feedback from peers and teachers
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Share Your Idea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Share Your Innovative Idea</DialogTitle>
              <DialogDescription>
                Tell us about your creative solution to make the world better.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Give your idea a catchy name"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your innovative idea in detail"
                  rows={5}
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL (Optional)</Label>
                <Input 
                  id="image" 
                  placeholder="Add an image URL to illustrate your idea"
                  value={newIdea.imageUrl}
                  onChange={(e) => setNewIdea({...newIdea, imageUrl: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitIdea}>Share Idea</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Search innovations..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea) => (
          <Card key={idea.id} className="card-hover">
            {idea.imageUrl && (
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={idea.imageUrl} 
                  alt={idea.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="sparkle">{idea.title}</CardTitle>
              <CardDescription>
                {new Date(idea.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{idea.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-500 flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" /> {idea.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500 flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" /> {idea.comments}
                </Button>
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredIdeas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No innovations found. Be the first to share an idea!</p>
        </div>
      )}
    </div>
  );
};

export default Innovation;

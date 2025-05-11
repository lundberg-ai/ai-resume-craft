
import React, { useState } from 'react';
import { Search, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface JobDescriptionInputProps {
  onSubmit: (description: string) => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ 
  onSubmit, 
  isDisabled = false,
  isLoading = false
}) => {
  const [inputType, setInputType] = useState<string>("text");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [jobUrl, setJobUrl] = useState<string>("");

  const handleSubmit = () => {
    if (inputType === "text" && jobDescription) {
      onSubmit(jobDescription);
    } else if (inputType === "url" && jobUrl) {
      // In a real implementation, you would fetch the job description from the URL
      onSubmit(`Job description from URL: ${jobUrl}`);
    }
  };

  const handleExampleClick = () => {
    const exampleDescription = `
    Senior Frontend Developer

    Responsibilities:
    - Design, develop, and maintain responsive web applications using React and TypeScript
    - Collaborate with backend developers to integrate REST APIs
    - Implement state management solutions using Redux or similar libraries
    - Write clean, maintainable code with appropriate test coverage
    - Optimize applications for maximum performance and scalability
    - Participate in code reviews and contribute to technical discussions

    Requirements:
    - 3+ years of experience with React and modern JavaScript
    - Strong understanding of TypeScript and type systems
    - Experience with state management libraries (Redux, MobX, or similar)
    - Familiarity with build tools like Webpack, Vite, or similar
    - Knowledge of responsive design principles and cross-browser compatibility
    - Experience with version control systems (Git)
    - Excellent problem-solving skills and attention to detail
    `;
    
    setJobDescription(exampleDescription);
    setInputType("text");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-xl font-medium mb-4">Enter Job Description</h3>
          
          <Tabs value={inputType} onValueChange={setInputType}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="text">Paste Text</TabsTrigger>
              <TabsTrigger value="url">Job URL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="animate-fade-in">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="job-description">Job Description</Label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the job description here..."
                    rows={10}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={handleExampleClick}
                    disabled={isDisabled}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Use example
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isDisabled || !jobDescription || isLoading}
                  >
                    {isLoading ? "Processing..." : (
                      <>
                        Optimize Resume
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="url" className="animate-fade-in">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="job-url">Job Posting URL</Label>
                  <Input
                    id="job-url"
                    placeholder="https://example.com/job-posting"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    disabled={isDisabled}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter a URL to a job posting, and we'll extract the description for you.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isDisabled || !jobUrl || isLoading}
                  >
                    {isLoading ? "Processing..." : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Fetch & Optimize
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDescriptionInput;


import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ResumeUploader from '@/components/ResumeUploader';
import JobDescriptionInput from '@/components/JobDescriptionInput';
import ResumePreview from '@/components/ResumePreview';
import ThemeSelector from '@/components/ThemeSelector';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';

interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  summary?: string;
  experience?: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education?: {
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
  }[];
  skills?: string[];
}

const Index: React.FC = () => {
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState<string>("upload");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("classic");
  const [selectedColor, setSelectedColor] = useState<string>("#9b87f5");
  
  const handleResumeUpload = (data: ResumeData) => {
    setResumeData(data);
    toast({
      title: "Resume uploaded successfully",
      description: "We've extracted information from your resume.",
    });
    setActiveStep("job");
  };

  const handleJobDescriptionSubmit = (description: string) => {
    setJobDescription(description);
    setIsProcessing(true);
    
    // Mock API call to process resume with AI
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Resume optimized!",
        description: "Your resume has been tailored for the job description.",
      });
      setActiveStep("preview");
    }, 2000);
  };

  const handleResumeDownload = () => {
    toast({
      title: "Resume downloaded",
      description: "Your tailored resume has been downloaded.",
    });
  };

  const handleUpdateResumeData = (updatedData: ResumeData) => {
    setResumeData(updatedData);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold font-display mb-4 animate-fade-in">
            Create Your Perfect Resume With AI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-in">
            Upload your existing resume, provide a job description, and let our AI tailor your resume to make you the perfect candidate.
          </p>
        </div>
        
        <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-xl mx-auto mb-8">
            <TabsTrigger value="upload">Upload Resume</TabsTrigger>
            <TabsTrigger value="job">Job Description</TabsTrigger>
            <TabsTrigger value="preview">Preview & Download</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="animate-fade-in">
            <ResumeUploader onUploadComplete={handleResumeUpload} />
          </TabsContent>
          
          <TabsContent value="job" className="animate-fade-in">
            <JobDescriptionInput 
              onSubmit={handleJobDescriptionSubmit}
              isDisabled={!resumeData}
              isLoading={isProcessing}
            />
          </TabsContent>
          
          <TabsContent value="preview" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <ThemeSelector 
                  selectedTheme={selectedTheme}
                  onThemeChange={setSelectedTheme}
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                />
                <div className="mt-8">
                  <Button 
                    onClick={handleResumeDownload} 
                    className="w-full"
                  >
                    Download Resume
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-2">
                {resumeData && (
                  <ResumePreview 
                    data={resumeData} 
                    theme={selectedTheme}
                    color={selectedColor}
                    onUpdate={handleUpdateResumeData}
                  />
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;

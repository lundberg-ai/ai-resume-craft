
import React, { useState, useRef } from 'react';
import { Upload, FileText, Search, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";

interface ResumeUploaderProps {
  onUploadComplete: (data: any) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUploadComplete }) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [textContent, setTextContent] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("file");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };
  
  const handleFileChange = (selectedFile: File) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      toast({
        title: "Unsupported file format",
        description: "Please upload a PDF or Word document.",
        variant: "destructive"
      });
      return;
    }
    
    setFile(selectedFile);
  };
  
  const handleProcessResume = () => {
    if (!file && !textContent.trim()) return;
    
    setIsProcessing(true);
    
    // In a real implementation, you would upload the file to a server and process it
    // For this demo, we'll simulate the process with a timeout and mock data
    setTimeout(() => {
      const mockResumeData = {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "(555) 123-4567",
        address: "San Francisco, CA",
        summary: "Experienced software engineer with 5+ years of experience in full-stack development. Proficient in React, Node.js, and cloud technologies.",
        experience: [
          {
            title: "Senior Software Engineer",
            company: "Tech Solutions Inc.",
            location: "San Francisco, CA",
            startDate: "Jan 2020",
            endDate: "Present",
            description: "Lead developer for customer-facing web applications. Improved application performance by 35%. Mentored junior developers."
          },
          {
            title: "Software Engineer",
            company: "WebDev Experts",
            location: "San Francisco, CA",
            startDate: "Mar 2017",
            endDate: "Dec 2019",
            description: "Developed and maintained e-commerce applications. Implemented new features and optimized database queries."
          }
        ],
        education: [
          {
            degree: "M.S. Computer Science",
            institution: "Stanford University",
            location: "Stanford, CA",
            startDate: "2015",
            endDate: "2017"
          },
          {
            degree: "B.S. Computer Science",
            institution: "University of California, Berkeley",
            location: "Berkeley, CA",
            startDate: "2011",
            endDate: "2015"
          }
        ],
        skills: ["JavaScript", "TypeScript", "React", "Node.js", "AWS", "Git", "CI/CD", "Agile Methodology"]
      };
      
      setIsProcessing(false);
      onUploadComplete(mockResumeData);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary border-2 border-black p-1 rounded-none">
          <TabsTrigger 
            value="file" 
            className="data-[state=active]:bg-neon-purple data-[state=active]:text-white rounded-none uppercase font-bold tracking-wide"
          >
            <Upload className="mr-2 h-4 w-4" />
            Ladda upp fil
          </TabsTrigger>
          <TabsTrigger 
            value="text" 
            className="data-[state=active]:bg-neon-purple data-[state=active]:text-white rounded-none uppercase font-bold tracking-wide"
          >
            <Type className="mr-2 h-4 w-4" />
            Klistra in text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <Card className="border border-dashed border-input">
            <CardContent className="pt-6">
              <div
                className={`flex flex-col items-center justify-center p-12 transition-colors rounded-lg ${
                  isDragging ? "bg-primary/10" : "bg-secondary/50"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  {file ? (
                    <FileText className="w-8 h-8 text-primary" />
                  ) : (
                    <Upload className="w-8 h-8 text-primary" />
                  )}
                </div>
                
                <h3 className="text-xl font-medium mb-2">
                  {file ? file.name : "Upload your resume"}
                </h3>
                
                <p className="text-muted-foreground text-center mb-6">
                  {file 
                    ? `${(file.size / 1024 / 1024).toFixed(2)} MB · ${file.type}`
                    : "Drag and drop your resume file here, or click to browse files"}
                </p>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                
                <Button
                  type="button"
                  onClick={() => file ? handleProcessResume() : fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="min-w-[180px] bg-neon-purple hover:bg-neon-purple/80 text-white rounded-none uppercase font-bold tracking-wide shadow-[5px_5px_0_rgba(0,0,0,0.5)]"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : file ? (
                    <>Process Resume</>
                  ) : (
                    <>Select File</>
                  )}
                </Button>
              </div>
              
              {!file && (
                <>
                  <Separator className="my-6" />
                  
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Want to see how it works first?
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Create a mock resume file
                        const mockFile = new File([""], "example-resume.pdf", {
                          type: "application/pdf",
                        });
                        handleFileChange(mockFile);
                      }}
                      className="border-2 border-black hover:bg-secondary rounded-none"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Use example resume
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text">
          <Card className="border border-dashed border-input">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Type className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Paste your resume text</h3>
                  <p className="text-muted-foreground mb-6">
                    Copy and paste your resume content directly into the text area below
                  </p>
                </div>
                
                <Textarea
                  placeholder="Paste your resume content here..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="min-h-[300px] brutalist-input resize-none"
                />
                
                <Button
                  type="button"
                  onClick={handleProcessResume}
                  disabled={isProcessing || !textContent.trim()}
                  className="w-full bg-neon-purple hover:bg-neon-purple/80 text-white rounded-none uppercase font-bold tracking-wide shadow-[5px_5px_0_rgba(0,0,0,0.5)]"
                >
                  {isProcessing ? "Processing..." : "Process Resume Text"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeUploader;


import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ResumeUploader from '@/components/ResumeUploader';
import JobDescriptionInput from '@/components/JobDescriptionInput';
import ResumePreview from '@/components/ResumePreview';
import ThemeSelector from '@/components/ThemeSelector';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, FileText, Eye, Download } from 'lucide-react';

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
      title: "CV uppladdad",
      description: "Vi har extraherat information från ditt CV.",
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
        title: "CV optimerad!",
        description: "Ditt CV har anpassats till den angivna jobbeskrivningen.",
      });
      setActiveStep("preview");
    }, 2000);
  };

  const handleResumeDownload = () => {
    toast({
      title: "CV nedladdad",
      description: "Ditt anpassade CV har laddats ner.",
    });
  };

  const handleUpdateResumeData = (updatedData: ResumeData) => {
    setResumeData(updatedData);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="hero-gradient">
        <div className="container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-blue-300">
              Nästa nivå av CV-skapande
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-in max-w-2xl mx-auto">
              Använd AI för att skapa ett CV som sticker ut i rekryteringsprocessen. Anpassa perfekt för varje tjänst du söker.
            </p>
            <Button 
              size="lg" 
              className="rounded-full text-lg px-8 animate-fade-in"
              onClick={() => document.getElementById('app-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Kom igång <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold font-display mb-12 text-center">Framtidens CV-verktyg</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-xl animate-fade-in">
              <div className="h-12 w-12 bg-primary/20 rounded-full mb-4 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Ladda upp CV</h3>
              <p className="text-muted-foreground">Ladda upp ditt befintliga CV och låt vår AI analysera och extrahera all relevant information.</p>
            </div>
            <div className="glass-card p-6 rounded-xl animate-fade-in delay-100">
              <div className="h-12 w-12 bg-primary/20 rounded-full mb-4 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Anpassa till jobbet</h3>
              <p className="text-muted-foreground">Klistra in jobbannonsen och låt AI:n skräddarsy ditt CV för att matcha tjänsten perfekt.</p>
            </div>
            <div className="glass-card p-6 rounded-xl animate-fade-in delay-200">
              <div className="h-12 w-12 bg-primary/20 rounded-full mb-4 flex items-center justify-center">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Förhandsvisa & redigera</h3>
              <p className="text-muted-foreground">Se resultatet direkt i browsern, redigera och justera innehållet innan du laddar ner.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* App Section */}
      <div id="app-section" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold font-display mb-4 animate-fade-in">
              Skapa ditt optimerade CV
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-in">
              Ladda upp ditt befintliga CV, ange jobbeskrivningen, och låt vår AI anpassa ditt CV för att göra dig till den perfekta kandidaten.
            </p>
          </div>
          
          <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-xl mx-auto mb-8 bg-secondary/50 p-1">
              <TabsTrigger value="upload" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Upload className="mr-2 h-4 w-4" />
                Ladda upp CV
              </TabsTrigger>
              <TabsTrigger value="job" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="mr-2 h-4 w-4" />
                Jobbeskrivning
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Eye className="mr-2 h-4 w-4" />
                Förhandsgranska
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="animate-fade-in">
              <div className="glass-card p-8 rounded-xl">
                <ResumeUploader onUploadComplete={handleResumeUpload} />
              </div>
            </TabsContent>
            
            <TabsContent value="job" className="animate-fade-in">
              <div className="glass-card p-8 rounded-xl">
                <JobDescriptionInput 
                  onSubmit={handleJobDescriptionSubmit}
                  isDisabled={!resumeData}
                  isLoading={isProcessing}
                />
              </div>
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
                      <Download className="mr-2 h-4 w-4" />
                      Ladda ner CV
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
      </div>

      {/* Testimonials Section */}
      <div className="py-16 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold font-display mb-12 text-center">Vad våra användare säger</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Anna Andersson</h4>
                  <p className="text-sm text-muted-foreground">UX Designer</p>
                </div>
              </div>
              <p className="text-muted-foreground">"Jag fick tre intervjuer på en vecka efter att ha använt ResumeCraft för att anpassa mitt CV. Otroligt verktyg!"</p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Erik Johansson</h4>
                  <p className="text-sm text-muted-foreground">Ekonomichef</p>
                </div>
              </div>
              <p className="text-muted-foreground">"AI:n förstod exakt vilka nyckelord som behövde lyftas fram för finansjobbet jag sökte. Imponerande!"</p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Maria Lindgren</h4>
                  <p className="text-sm text-muted-foreground">Mjukvaruutvecklare</p>
                </div>
              </div>
              <p className="text-muted-foreground">"Snabbt, elegant och effektivt. Mitt CV ser nu ut som något skapat av en professionell designer."</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

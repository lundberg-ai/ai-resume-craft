
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ResumeUploader from '@/components/ResumeUploader';
import JobDescriptionInput from '@/components/JobDescriptionInput';
import ResumePreview from '@/components/ResumePreview';
import ThemeSelector from '@/components/ThemeSelector';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, FileText, Eye, Download, Sparkles } from 'lucide-react';

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
      <div className="hero-gradient relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 border-2 border-neon-purple rotate-45 opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border-2 border-black/10 -rotate-12 opacity-10"></div>
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-neon-purple/10 rounded-sm"></div>
        </div>
        
        <div className="container mx-auto px-6 py-32 md:py-40 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 inline-block">
              <span className="px-4 py-2 bg-neon-purple text-white font-bold uppercase text-sm tracking-wider">
                Ny version 2.0
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 animate-fade-in uppercase tracking-tight">
              <span className="text-neon-purple">NÄ</span>STA NIVÅ AV<br />
              <span className="text-neon-purple">CV</span>-SKAPANDE
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-in max-w-2xl border-l-4 border-neon-purple pl-4">
              Använd AI för att skapa ett CV som sticker ut i rekryteringsprocessen. Anpassa perfekt för varje tjänst du söker.
            </p>
            <Button 
              size="lg" 
              className="rounded-none text-lg px-8 animate-fade-in bg-neon-purple hover:bg-neon-purple/80 text-white font-bold uppercase tracking-wide shadow-[5px_5px_0_rgba(0,0,0,0.5)]"
              onClick={() => document.getElementById('app-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Kom igång <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* App Section - Moved up */}
      <div id="app-section" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-neon-purple mr-4" />
              <h2 className="text-3xl font-bold font-display uppercase tracking-tight">
                <span className="text-neon-purple">Skapa</span> ditt optimerade CV
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-in text-center">
              Ladda upp ditt befintliga CV, ange jobbeskrivningen, och låt vår AI anpassa ditt CV för att göra dig till den perfekta kandidaten.
            </p>
          </div>
          
          <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-xl mx-auto mb-10 bg-secondary border-2 border-black p-1 rounded-none">
              <TabsTrigger 
                value="upload" 
                className="data-[state=active]:bg-neon-purple data-[state=active]:text-white rounded-none uppercase font-bold tracking-wide"
              >
                <Upload className="mr-2 h-4 w-4" />
                Ladda upp CV
              </TabsTrigger>
              <TabsTrigger 
                value="job" 
                className="data-[state=active]:bg-neon-purple data-[state=active]:text-white rounded-none uppercase font-bold tracking-wide"
              >
                <FileText className="mr-2 h-4 w-4" />
                Jobbeskrivning
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="data-[state=active]:bg-neon-purple data-[state=active]:text-white rounded-none uppercase font-bold tracking-wide"
              >
                <Eye className="mr-2 h-4 w-4" />
                Förhandsgranska
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="animate-fade-in">
              <div className="brutalist-card p-8">
                <ResumeUploader onUploadComplete={handleResumeUpload} />
              </div>
            </TabsContent>
            
            <TabsContent value="job" className="animate-fade-in">
              <div className="brutalist-card p-8">
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
                      className="w-full bg-neon-purple hover:bg-neon-purple/80 text-white uppercase font-bold tracking-wide rounded-none shadow-[5px_5px_0_rgba(0,0,0,0.5)]"
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

      {/* Features Section - Moved down */}
      <div className="py-24 bg-secondary relative border-y-2 border-black">
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-bold font-display mb-12 text-center uppercase tracking-tight">
            <span className="text-neon-purple">FRAM</span>TIDENS CV-VERKTYG
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="brutalist-card p-8 animate-fade-in">
              <div className="h-16 w-16 bg-neon-purple/20 mb-6 flex items-center justify-center">
                <Upload className="h-8 w-8 text-neon-purple" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-foreground uppercase tracking-wide">Ladda upp CV</h3>
              <p className="text-muted-foreground">Ladda upp ditt befintliga CV och låt vår AI analysera och extrahera all relevant information.</p>
            </div>
            <div className="brutalist-card p-8 animate-fade-in delay-100">
              <div className="h-16 w-16 bg-neon-purple/20 mb-6 flex items-center justify-center">
                <FileText className="h-8 w-8 text-neon-purple" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-foreground uppercase tracking-wide">Anpassa till jobbet</h3>
              <p className="text-muted-foreground">Klistra in jobbannonsen och låt AI:n skräddarsy ditt CV för att matcha tjänsten perfekt.</p>
            </div>
            <div className="brutalist-card p-8 animate-fade-in delay-200">
              <div className="h-16 w-16 bg-neon-purple/20 mb-6 flex items-center justify-center">
                <Eye className="h-8 w-8 text-neon-purple" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-foreground uppercase tracking-wide">Förhandsvisa</h3>
              <p className="text-muted-foreground">Se resultatet direkt i browsern, redigera och justera innehållet innan du laddar ner.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-background relative border-y-2 border-black">
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-bold font-display mb-16 text-center uppercase tracking-tight">
            <span className="text-neon-purple">VAD</span> VÅRA ANVÄNDARE SÄGER
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="brutalist-card p-8 hover:shadow-[5px_5px_0_rgba(155,135,245,0.8)] transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-neon-purple/20 flex items-center justify-center">
                  <div className="w-12 h-12 bg-background flex items-center justify-center text-neon-purple font-bold text-lg">A</div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-neon-purple uppercase tracking-wider">Anna Andersson</h4>
                  <p className="text-sm text-muted-foreground">UX Designer</p>
                </div>
              </div>
              <p className="text-muted-foreground">"Jag fick tre intervjuer på en vecka efter att ha använt ResumeCraft för att anpassa mitt CV. Otroligt verktyg!"</p>
            </div>
            <div className="brutalist-card p-8 hover:shadow-[5px_5px_0_rgba(155,135,245,0.8)] transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-neon-purple/20 flex items-center justify-center">
                  <div className="w-12 h-12 bg-background flex items-center justify-center text-neon-purple font-bold text-lg">E</div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-neon-purple uppercase tracking-wider">Erik Johansson</h4>
                  <p className="text-sm text-muted-foreground">Ekonomichef</p>
                </div>
              </div>
              <p className="text-muted-foreground">"AI:n förstod exakt vilka nyckelord som behövde lyftas fram för finansjobbet jag sökte. Imponerande!"</p>
            </div>
            <div className="brutalist-card p-8 hover:shadow-[5px_5px_0_rgba(155,135,245,0.8)] transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-neon-purple/20 flex items-center justify-center">
                  <div className="w-12 h-12 bg-background flex items-center justify-center text-neon-purple font-bold text-lg">M</div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-neon-purple uppercase tracking-wider">Maria Lindgren</h4>
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

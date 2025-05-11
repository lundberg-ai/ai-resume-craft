
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
  const [selectedColor, setSelectedColor] = useState<string>("#FFD700");
  
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
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gold/5 blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-gold/5 blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }}></div>
        </div>
        
        <div className="container mx-auto px-6 py-32 md:py-40 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 animate-fade-in gold-gradient">
              Nästa nivå av CV-skapande
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-in max-w-2xl mx-auto">
              Använd AI för att skapa ett CV som sticker ut i rekryteringsprocessen. Anpassa perfekt för varje tjänst du söker.
            </p>
            <Button 
              size="lg" 
              className="rounded-full text-lg px-8 animate-fade-in bg-gold hover:bg-gold/80 text-black"
              onClick={() => document.getElementById('app-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Kom igång <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 backdrop-blur-sm bg-luxury-dark/80 relative">
        <div className="absolute inset-0 bg-gradient-conic from-luxury-dark via-luxury-dark/90 to-black/80 opacity-60"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl font-bold font-display mb-12 text-center gold-gradient">Framtidens CV-verktyg</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="luxury-glass p-8 rounded-xl animate-fade-in luxury-border">
              <div className="h-16 w-16 bg-gold/10 rounded-full mb-6 flex items-center justify-center animate-float">
                <Upload className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-white">Ladda upp CV</h3>
              <p className="text-muted-foreground">Ladda upp ditt befintliga CV och låt vår AI analysera och extrahera all relevant information.</p>
            </div>
            <div className="luxury-glass p-8 rounded-xl animate-fade-in delay-100 luxury-border">
              <div className="h-16 w-16 bg-gold/10 rounded-full mb-6 flex items-center justify-center animate-float" style={{ animationDelay: "1s" }}>
                <FileText className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-white">Anpassa till jobbet</h3>
              <p className="text-muted-foreground">Klistra in jobbannonsen och låt AI:n skräddarsy ditt CV för att matcha tjänsten perfekt.</p>
            </div>
            <div className="luxury-glass p-8 rounded-xl animate-fade-in delay-200 luxury-border">
              <div className="h-16 w-16 bg-gold/10 rounded-full mb-6 flex items-center justify-center animate-float" style={{ animationDelay: "2s" }}>
                <Eye className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-white">Förhandsvisa & redigera</h3>
              <p className="text-muted-foreground">Se resultatet direkt i browsern, redigera och justera innehållet innan du laddar ner.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* App Section */}
      <div id="app-section" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-luxury-dark/50 to-background z-0"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16 text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-gold mr-4" />
              <h2 className="text-3xl font-bold font-display gold-gradient">
                Skapa ditt optimerade CV
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-in">
              Ladda upp ditt befintliga CV, ange jobbeskrivningen, och låt vår AI anpassa ditt CV för att göra dig till den perfekta kandidaten.
            </p>
          </div>
          
          <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-xl mx-auto mb-10 bg-luxury-dark/50 border border-white/10 p-1">
              <TabsTrigger 
                value="upload" 
                className="data-[state=active]:bg-gold data-[state=active]:text-black"
              >
                <Upload className="mr-2 h-4 w-4" />
                Ladda upp CV
              </TabsTrigger>
              <TabsTrigger 
                value="job" 
                className="data-[state=active]:bg-gold data-[state=active]:text-black"
              >
                <FileText className="mr-2 h-4 w-4" />
                Jobbeskrivning
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="data-[state=active]:bg-gold data-[state=active]:text-black"
              >
                <Eye className="mr-2 h-4 w-4" />
                Förhandsgranska
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="animate-fade-in">
              <div className="luxury-glass p-8 rounded-xl luxury-border">
                <ResumeUploader onUploadComplete={handleResumeUpload} />
              </div>
            </TabsContent>
            
            <TabsContent value="job" className="animate-fade-in">
              <div className="luxury-glass p-8 rounded-xl luxury-border">
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
                      className="w-full bg-gold hover:bg-gold/80 text-black"
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
      <div className="py-24 backdrop-blur-sm bg-luxury-dark/80 relative">
        <div className="absolute inset-0 bg-gradient-conic from-luxury-dark via-luxury-dark/90 to-black/80 opacity-60"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl font-bold font-display mb-16 text-center gold-gradient">Vad våra användare säger</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="luxury-glass p-8 rounded-xl luxury-border hover:shadow-[0_0_25px_rgba(255,215,0,0.2)] transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-luxury-dark flex items-center justify-center text-gold font-bold text-lg">A</div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gold">Anna Andersson</h4>
                  <p className="text-sm text-muted-foreground">UX Designer</p>
                </div>
              </div>
              <p className="text-muted-foreground">"Jag fick tre intervjuer på en vecka efter att ha använt ResumeCraft för att anpassa mitt CV. Otroligt verktyg!"</p>
            </div>
            <div className="luxury-glass p-8 rounded-xl luxury-border hover:shadow-[0_0_25px_rgba(255,215,0,0.2)] transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-luxury-dark flex items-center justify-center text-gold font-bold text-lg">E</div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gold">Erik Johansson</h4>
                  <p className="text-sm text-muted-foreground">Ekonomichef</p>
                </div>
              </div>
              <p className="text-muted-foreground">"AI:n förstod exakt vilka nyckelord som behövde lyftas fram för finansjobbet jag sökte. Imponerande!"</p>
            </div>
            <div className="luxury-glass p-8 rounded-xl luxury-border hover:shadow-[0_0_25px_rgba(255,215,0,0.2)] transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-luxury-dark flex items-center justify-center text-gold font-bold text-lg">M</div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gold">Maria Lindgren</h4>
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

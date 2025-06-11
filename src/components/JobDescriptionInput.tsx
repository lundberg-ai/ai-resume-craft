
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
    Senior Frontendutvecklare

    Ansvarsområden:
    - Designa, utveckla och underhålla responsiva webbapplikationer med React och TypeScript
    - Samarbeta med backend-utvecklare för att integrera REST API:er
    - Implementera lösningar för state management med Redux eller liknande bibliotek
    - Skriva ren, underhållbar kod med lämplig testtäckning
    - Optimera applikationer för maximal prestanda och skalbarhet
    - Delta i kodgranskningar och bidra till tekniska diskussioner

    Krav:
    - 3+ års erfarenhet av React och modern JavaScript
    - Stark förståelse för TypeScript och typsystem
    - Erfarenhet av state management-bibliotek (Redux, MobX eller liknande)
    - Förtrogenhet med byggverktyg som Webpack, Vite eller liknande
    - Kunskap om responsiv design och kompatibilitet mellan webbläsare
    - Erfarenhet av versionskontrollsystem (Git)
    - Utmärkta problemlösningsförmågor och uppmärksamhet för detaljer
    `;

    setJobDescription(exampleDescription);
    setInputType("text");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>        <CardContent className="pt-6">
        <h3 className="text-xl font-medium mb-4">Ange jobbeskrivning</h3>

        <Tabs value={inputType} onValueChange={setInputType}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="text">Klistra in text</TabsTrigger>
            <TabsTrigger value="url">Jobb-URL</TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="animate-fade-in">
            <div className="space-y-4">
              <div>
                <Label htmlFor="job-description">Jobbeskrivning</Label>
                <Textarea
                  id="job-description"
                  placeholder="Klistra in jobbeskrivningen här..."
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
                  Använd exempel
                </Button>

                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isDisabled || !jobDescription || isLoading}
                >
                  {isLoading ? "Bearbetar..." : (
                    <>
                      Optimera CV
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
                <Label htmlFor="job-url">URL till jobbannonsen</Label>
                <Input
                  id="job-url"
                  placeholder="https://example.com/jobbannonsen"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  disabled={isDisabled}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Ange en URL till en jobbannons så extraherar vi beskrivningen åt dig.
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isDisabled || !jobUrl || isLoading}
                >
                  {isLoading ? "Bearbetar..." : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Hämta & optimera
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

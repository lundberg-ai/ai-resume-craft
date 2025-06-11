
import React, { useState, useEffect } from 'react';
import { Search, FileText, ArrowRight, Eye, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from '@google/generative-ai';

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
  const { toast } = useToast();
  const [inputType, setInputType] = useState<string>("text");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [jobUrl, setJobUrl] = useState<string>("");
  const [extractedContent, setExtractedContent] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [showExtracted, setShowExtracted] = useState<boolean>(false);

  // Show character/word count feedback for manual text input
  useEffect(() => {
    if (jobDescription.trim().length > 0 && inputType === "text") {
      // Debounce the feedback
      const timeoutId = setTimeout(() => {
        const wordCount = jobDescription.trim().split(/\s+/).filter(word => word.length > 0).length;
        console.log('Job description text input:', jobDescription);
        toast({
          title: "Jobbeskrivning inmatad",
          description: `${jobDescription.length} tecken, ${wordCount} ord klara`,
          duration: 2000,
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [jobDescription, inputType, toast]);

  // Validate if extracted content is actually job-related and not error pages
  const validateJobContent = (text: string): { isValid: boolean; reason: string } => {
    const lowerText = text.toLowerCase();

    // Check for cookie consent pages
    const cookieIndicators = [
      'cookies',
      'cookie policy',
      'cookiepolicy',
      'gdpr',
      'personuppgifter',
      'personuppgiftspolicy',
      'integritetspolicy',
      'använder cookies',
      'accept cookies',
      'cookie consent'
    ];

    // Check for error pages
    const errorIndicators = [
      '404',
      '403',
      '500',
      'not found',
      'page not found',
      'access denied',
      'server error',
      'hittas inte',
      'fel uppstod',
      'kunde inte hittas'
    ];

    // Check for login/access pages
    const accessIndicators = [
      'log in',
      'sign in',
      'logga in',
      'inloggning',
      'användarnamn',
      'password',
      'lösenord'
    ];

    // Count how many cookie/error indicators appear
    let cookieScore = 0;
    let errorScore = 0;
    let accessScore = 0;

    cookieIndicators.forEach(indicator => {
      if (lowerText.includes(indicator)) cookieScore++;
    });

    errorIndicators.forEach(indicator => {
      if (lowerText.includes(indicator)) errorScore++;
    });

    accessIndicators.forEach(indicator => {
      if (lowerText.includes(indicator)) accessScore++;
    });

    // If too many cookie indicators, it's likely a cookie page
    if (cookieScore >= 2 && text.length < 2000) {
      return {
        isValid: false,
        reason: 'Webbsidan visar endast cookie-information. Försök med en direktlänk till jobbannonsen.'
      };
    }

    // If error indicators, it's an error page
    if (errorScore >= 1) {
      return {
        isValid: false,
        reason: 'Webbsidan kunde inte hittas eller är inte tillgänglig. Kontrollera URL:en.'
      };
    }

    // If mostly login content
    if (accessScore >= 2 && text.length < 1000) {
      return {
        isValid: false,
        reason: 'Webbsidan kräver inloggning. Försök med en offentlig jobbannons istället.'
      };
    }

    // Check for job-related keywords to confirm it's actually a job posting
    const jobKeywords = [
      'jobb',
      'tjänst',
      'position',
      'ansökan',
      'erfarenhet',
      'kompetens',
      'kvalifikationer',
      'arbetsuppgifter',
      'anställning',
      'lön',
      'benefits',
      'krav',
      'meriter',
      'utbildning',
      'kandidat'
    ];

    let jobScore = 0;
    jobKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) jobScore++;
    });

    // If very little job-related content
    if (jobScore < 2 && text.length > 500) {
      return {
        isValid: false,
        reason: 'Kunde inte hitta jobbeskrivning på sidan. Kontrollera att länken går till en jobbannons.'
      };
    }

    return { isValid: true, reason: '' };
  };

  // Initialize Gemini AI (you'll need to add your API key)
  const extractJobDescriptionFromWebsite = async (url: string): Promise<string> => {
    try {
      // List of CORS proxies to try (in order of preference)
      const corsProxies = [
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        `https://cors-anywhere.herokuapp.com/${url}`,
      ];

      let htmlContent = '';
      let lastError = null;

      // Try each proxy until one works
      for (const proxyUrl of corsProxies) {
        try {
          console.log(`Trying proxy: ${proxyUrl.split('?')[0]}`);

          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.text();

          // Handle different proxy response formats
          if (proxyUrl.includes('allorigins.win')) {
            const jsonData = JSON.parse(data);
            htmlContent = jsonData.contents;
          } else if (proxyUrl.includes('codetabs.com')) {
            htmlContent = data;
          } else {
            htmlContent = data;
          }

          if (htmlContent && htmlContent.length > 100) {
            console.log(`Successfully fetched content using: ${proxyUrl.split('?')[0]}`);
            break; // Success, exit the loop
          }
        } catch (error) {
          console.log(`Proxy failed: ${proxyUrl.split('?')[0]}`, error);
          lastError = error;
          continue; // Try next proxy
        }
      }

      if (!htmlContent || htmlContent.length < 100) {
        throw new Error('Alla CORS-proxies misslyckades. Försök med en annan URL eller klistra in texten manuellt.');
      }

      // Extract text content from HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Remove script and style elements
      const scripts = doc.querySelectorAll('script, style, nav, header, footer, aside');
      scripts.forEach(el => el.remove());

      // Get text content
      const textContent = doc.body?.textContent || doc.textContent || '';      // Clean up the text
      const cleanedText = textContent
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, ' ')
        .replace(/\t+/g, ' ')
        .trim()
        .substring(0, 8000); // Increase limit for better content capture

      // Validate content quality - detect cookie pages, error pages, etc.
      const isValidJobContent = validateJobContent(cleanedText);
      if (!isValidJobContent.isValid) {
        throw new Error(isValidJobContent.reason);
      }// Use Gemini AI to extract job description
      // NOTE: You'll need to add your Gemini API key as an environment variable
      const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!geminiApiKey || geminiApiKey.trim() === '') {
        // Fallback to simple text extraction without AI
        console.log('No Gemini API key found, using basic text extraction');
        return cleanedText;
      }

      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        // Use the current model name - gemini-1.5-flash is free and available
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); const prompt = `
          Du är en expert på att extrahera jobbeskrivningar från webbsidor. Analysera följande text och BARA extrahera ren jobbinformation.

          OM texten bara innehåller:
          - Cookie-meddelanden
          - GDPR/integritetspolicys  
          - Felmeddelanden (404, 403, etc.)
          - Inloggningsformulär
          - Allmän företagsinformation utan specifik jobbannons
          
          SVARA EXAKT: "INGEN_JOBBESKRIVNING_HITTAD"

          OM det finns riktig jobbinformation, extrahera och strukturera:
          - Jobbtitel
          - Krav och kvalifikationer
          - Arbetsuppgifter och ansvar
          - Företagsinformation
          
          Text från webbsidan:
          ${cleanedText}
          
          Returnera antingen "INGEN_JOBBESKRIVNING_HITTAD" eller den rena jobbeskrivningen på svenska:
        `;

        const result = await model.generateContent(prompt);
        const response_text = result.response.text();

        // Check if AI detected non-job content
        if (response_text && response_text.includes('INGEN_JOBBESKRIVNING_HITTAD')) {
          throw new Error('Kunde inte hitta en jobbeskrivning på denna sida. Försök med en direktlänk till jobbannonsen.');
        }

        return response_text || cleanedText;
      } catch (aiError) {
        console.log('AI extraction failed, falling back to basic text extraction:', aiError);
        // If AI fails, use the cleaned text as fallback
        return cleanedText;
      }
    } catch (error) {
      console.error('Error extracting from website:', error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
          throw new Error('Webbsidan blockerar åtkomst. Försök klistra in jobbeskrivningen manuellt istället.');
        } else if (error.message.includes('proxies')) {
          throw new Error(error.message);
        } else {
          throw new Error(`Kunde inte ladda webbsidan: ${error.message}`);
        }
      }

      throw new Error('Oväntat fel vid extrahering av jobbeskrivning från webbsidan');
    }
  };
  const handleExtractFromUrl = async () => {
    if (!jobUrl.trim()) return;

    // Basic URL validation
    try {
      new URL(jobUrl);
    } catch {
      toast({
        title: "Ogiltig URL",
        description: "Kontrollera att URL:en är korrekt formaterad (t.ex. https://example.com)",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    try {
      const extracted = await extractJobDescriptionFromWebsite(jobUrl);

      if (!extracted || extracted.length < 50) {
        throw new Error('Kunde inte hitta tillräckligt med innehåll på webbsidan');
      }

      setExtractedContent(extracted);
      setShowExtracted(true);

      const wordCount = extracted.trim().split(/\s+/).filter(word => word.length > 0).length;
      toast({
        title: "Jobbeskrivning extraherad",
        description: `${extracted.length} tecken, ${wordCount} ord extraherade från webbsidan`,
        duration: 3000,
      });

      console.log('Extracted from website:', extracted);

    } catch (error) {
      toast({
        title: "Fel vid extrahering",
        description: error instanceof Error ? error.message : "Kunde inte extrahera från webbsidan",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = () => {
    if (inputType === "text" && jobDescription) {
      onSubmit(jobDescription);
    } else if (inputType === "url" && extractedContent) {
      onSubmit(extractedContent);
    } else if (inputType === "url" && jobUrl && !extractedContent) {
      // If user hasn't extracted yet, do it first
      handleExtractFromUrl();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>        <CardContent className="pt-6">
        <h3 className="text-xl font-medium mb-4">Ange jobbeskrivning</h3>

        <Tabs value={inputType} onValueChange={setInputType}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="text">Klistra in text</TabsTrigger>
            <TabsTrigger value="url">Jobb-URL</TabsTrigger>
          </TabsList>          <TabsContent value="text" className="animate-fade-in">
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
                {jobDescription.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {jobDescription.length} tecken, {jobDescription.trim().split(/\s+/).filter(word => word.length > 0).length} ord inmatade
                  </p>
                )}
              </div>

              <div className="flex justify-end">
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
          </TabsContent>          <TabsContent value="url" className="animate-fade-in">
            <div className="space-y-4">
              <div>
                <Label htmlFor="job-url">URL till jobbannonsen</Label>
                <Input
                  id="job-url"
                  placeholder="https://example.com/jobbannonsen"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  disabled={isDisabled || isExtracting}
                />                <p className="text-sm text-muted-foreground mt-2">
                  Ange en URL till en jobbannons så extraherar vi beskrivningen åt dig.
                  <br />
                  <span className="text-xs">Tips: Fungerar bäst med offentliga jobbannonser (Arbetsförmedlingen, företagssidor, etc.)</span>
                </p>
              </div>

              {!showExtracted ? (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={handleExtractFromUrl}
                    disabled={isDisabled || !jobUrl || isExtracting}
                  >
                    {isExtracting ? "Extraherar..." : (
                      <>
                        <Globe className="mr-2 h-4 w-4" />
                        Extrahera från webbsida
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="extracted-content">Extraherad jobbeskrivning</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowExtracted(false);
                          setExtractedContent("");
                        }}
                      >
                        <Search className="mr-2 h-4 w-4" />
                        Extrahera igen
                      </Button>
                    </div>
                    <Textarea
                      id="extracted-content"
                      value={extractedContent}
                      onChange={(e) => setExtractedContent(e.target.value)}
                      className="min-h-[200px]"
                      placeholder="Extraherad jobbeskrivning visas här..."
                    />
                    {extractedContent.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {extractedContent.length} tecken, {extractedContent.trim().split(/\s+/).filter(word => word.length > 0).length} ord extraherade
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isDisabled || !extractedContent || isLoading}
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
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      </Card>
    </div>
  );
};

export default JobDescriptionInput;


import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Search, Type, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from 'pdfjs-dist';
import { ResumeTextParser } from '@/utils/resumeTextParser';

interface ResumeUploaderProps {
  onUploadComplete: (data: any) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUploadComplete }) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [textContent, setTextContent] = useState<string>("");
  const [extractedPDFText, setExtractedPDFText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("file"); const fileInputRef = useRef<HTMLInputElement>(null);  // Configure PDF.js worker
  useEffect(() => {
    // Use the worker from the installed package
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
  }, []);

  // Show dynamic character count feedback when text is entered manually
  useEffect(() => {
    if (textContent.trim().length > 0 && activeTab === "text") {
      // Debounce the toast to avoid spam - only show after user stops typing
      const timeoutId = setTimeout(() => {
        const wordCount = textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
        toast({
          title: "Text inmatad",
          description: `${textContent.length} tecken, ${wordCount} ord extraherade`,
          duration: 2000,
        });
        console.log('Manual text input:', textContent);
      }, 1000); // Wait 1 second after user stops typing

      return () => clearTimeout(timeoutId);
    }
  }, [textContent, activeTab, toast]);

  const removeFile = () => {
    setFile(null);
    setExtractedPDFText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "Fil borttagen",
      description: "Du kan nu ladda upp en ny fil",
      duration: 1500,
    });
  };

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
  }; const handleFileChange = async (selectedFile: File) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast({
        title: "Filformat stöds inte",
        description: "Vänligen ladda upp ett PDF- eller Word-dokument.",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    // Extract text from PDF
    if (selectedFile.type === 'application/pdf') {
      try {
        const extractedText = await extractTextFromPDF(selectedFile);
        setExtractedPDFText(extractedText);
        console.log('Extracted PDF text:', extractedText);

        // Show quick feedback to user
        toast({
          title: "PDF-text extraherad",
          description: `Extraherade ${extractedText.length} tecken från PDF:en`,
          duration: 2000,
        });
      } catch (error) {
        console.error('Error extracting text from PDF:', error);
        toast({
          title: "Fel vid textextrahering",
          description: "Kunde inte extrahera text från PDF:en",
          variant: "destructive"
        });
      }
    }
  };
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const typedArray = new Uint8Array(arrayBuffer);

      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({
        data: typedArray,
        cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
        cMapPacked: true,
      });

      const pdf = await loadingTask.promise;
      let fullText = '';

      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ');

        fullText += pageText + '\n\n';
      }

      return fullText.trim();
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Kunde inte extrahera text från PDF:en');
    }
  };

  const handleProcessResume = () => {
    if (!file && !textContent.trim()) return;

    setIsProcessing(true);

    setTimeout(() => {
      let resumeText = '';

      // Use extracted PDF text or manual text input
      if (file && extractedPDFText) {
        resumeText = extractedPDFText;
        console.log('📄 Using extracted PDF text for parsing');
      } else if (textContent.trim()) {
        resumeText = textContent;
        console.log('📝 Using manually entered text for parsing');
      }

      console.log('🔍 Resume text to parse:', resumeText.substring(0, 300) + '...');

      // Parse the actual resume text instead of using mock data
      const parsedResumeData = ResumeTextParser.parseResumeText(resumeText);

      console.log('✅ Parsed resume data from actual text:', parsedResumeData);

      setIsProcessing(false);
      onUploadComplete(parsedResumeData);
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
            <CardContent className="pt-6">              <div
              className={`flex flex-col items-center justify-center p-12 transition-colors rounded-lg relative ${isDragging ? "bg-primary/10" : "bg-secondary/50"
                }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {file && (
                <Button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-3 right-3 h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                  title="Ta bort fil"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                {file ? (
                  <FileText className="w-8 h-8 text-primary" />
                ) : (
                  <Upload className="w-8 h-8 text-primary" />
                )}
              </div>
              <h3 className="text-xl font-medium mb-2">
                {file ? file.name : "Ladda upp ditt CV"}
              </h3>

              <p className="text-muted-foreground text-center mb-6">
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB · ${file.type}`
                  : "Dra och släpp din CV-fil här, eller klicka för att bläddra bland filer"}
              </p>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => file ? handleProcessResume() : fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="min-w-[180px] bg-neon-purple hover:bg-neon-purple/80 text-white rounded-none uppercase font-bold tracking-wide shadow-[5px_5px_0_rgba(0,0,0,0.5)]"
                >
                  {isProcessing ? (
                    <>Bearbetar...</>
                  ) : file ? (
                    <>Bearbeta CV</>
                  ) : (
                    <>Välj fil</>
                  )}
                </Button>
              </div>
            </div>
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
                  </div>                  <h3 className="text-xl font-medium mb-2">Klistra in din CV-text</h3>
                  <p className="text-muted-foreground mb-6">
                    Kopiera och klistra in ditt CV-innehåll direkt i textområdet nedan
                  </p>
                </div>                <div>
                  <Textarea
                    placeholder="Klistra in ditt CV-innehåll här..."
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="min-h-[300px] brutalist-input resize-none"
                  />
                  {textContent.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {textContent.length} tecken, {textContent.trim().split(/\s+/).filter(word => word.length > 0).length} ord inmatade
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={handleProcessResume}
                  disabled={isProcessing || !textContent.trim()}
                  className="w-full bg-neon-purple hover:bg-neon-purple/80 text-white rounded-none uppercase font-bold tracking-wide shadow-[5px_5px_0_rgba(0,0,0,0.5)]"
                >
                  {isProcessing ? "Bearbetar..." : "Bearbeta CV-text"}
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

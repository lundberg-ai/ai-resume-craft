
import React, { useState, useEffect } from 'react';
import { Edit, Eye, EyeOff, Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { OptimizedResumeData } from '@/types/optimizedResume';
import PDFGenerator from '@/components/PDFGenerator';
import { useToast } from "@/hooks/use-toast";

interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  experience?: {
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education?: {
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
  }[];
  skills?: string[];
}

interface ResumePreviewProps {
  data: ResumeData;
  optimizedData?: OptimizedResumeData | null;
  theme: string;
  color: string;
  onUpdate: (data: ResumeData) => void;
  onDownload?: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  data,
  optimizedData,
  theme,
  color,
  onUpdate,
  onDownload
}) => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showOptimized, setShowOptimized] = useState<boolean>(!!optimizedData);

  // Use optimized data for editing if available and showOptimized is true
  const getEditableData = () => {
    if (showOptimized && optimizedData) {
      return {
        name: optimizedData.personalInfo.name,
        email: optimizedData.personalInfo.email,
        phone: optimizedData.personalInfo.phone,
        summary: optimizedData.profileSummary,
        experience: optimizedData.workExperience.map(exp => ({
          title: exp.title,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.endDate,
          description: exp.description
        })),
        education: optimizedData.education.map(edu => ({
          degree: edu.degree,
          institution: edu.institution,
          startDate: edu.startDate,
          endDate: edu.endDate
        })),
        skills: optimizedData.coreCompetencies
      };
    }
    return data;
  };

  const [editableData, setEditableData] = useState<ResumeData>(getEditableData());

  // Update editableData when showOptimized changes
  useEffect(() => {
    setEditableData(getEditableData());
  }, [showOptimized, optimizedData]);

  // Use optimized data if available and showOptimized is true
  const displayData = showOptimized && optimizedData ? {
    name: optimizedData.personalInfo.name,
    email: optimizedData.personalInfo.email,
    phone: optimizedData.personalInfo.phone,
    summary: optimizedData.profileSummary,
    experience: optimizedData.workExperience.map(exp => ({
      title: exp.title,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description
    })),
    education: optimizedData.education.map(edu => ({
      degree: edu.degree,
      institution: edu.institution,
      startDate: edu.startDate,
      endDate: edu.endDate
    })),
    skills: optimizedData.coreCompetencies
  } : data;

  const handleDownload = () => {
    console.log('🎯 Preparing PDF download with data:', showOptimized && optimizedData ? optimizedData : data);

    if (onDownload) {
      onDownload();
    } else {
      console.log('💡 PDF generation will be implemented here');
      console.log('📊 Data structure ready for react-pdf:', displayData);
    }
  }; const handleSaveEdit = () => {
    // Always update the base data for now since the parent expects ResumeData format
    onUpdate(editableData);
    setEditMode(false);

    toast({
      title: "Ändringar sparade!",
      description: "Dina redigeringar har sparats och visas nu i förhandsvisningen.",
      duration: 3000,
    });

    console.log('✅ Changes saved to resume data');
  };

  const handleCancelEdit = () => {
    // Reset to current data (discard changes)
    setEditableData(getEditableData());
    setEditMode(false);

    toast({
      title: "Redigering avbruten",
      description: "Alla ändringar har återställts.",
      duration: 2000,
    });
  };

  const handleDataChange = (field: string, value: string) => {
    setEditableData({
      ...editableData,
      [field]: value
    });
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    if (!editableData.experience) return;

    const updatedExperience = [...editableData.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    };

    setEditableData({
      ...editableData,
      experience: updatedExperience
    });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    if (!editableData.education) return;

    const updatedEducation = [...editableData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };

    setEditableData({
      ...editableData,
      education: updatedEducation
    });
  };

  const handleSkillChange = (index: number, value: string) => {
    if (!editableData.skills) return;

    const updatedSkills = [...editableData.skills];
    updatedSkills[index] = value;

    setEditableData({
      ...editableData,
      skills: updatedSkills
    });
  };

  const getHeaderClass = () => {
    switch (theme) {
      case 'modern':
        return 'theme-modern resume-header';
      case 'minimal':
        return 'theme-minimal resume-header';
      case 'creative':
        return 'theme-creative resume-header';
      case 'professional':
        return 'theme-professional resume-header';
      default:
        return 'theme-classic resume-header';
    }
  };

  // Custom style based on selected color
  const customStyle = {
    '--resume-color': color
  } as React.CSSProperties;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">CV-förhandsvisning</h3>
        <div className="flex items-center space-x-2">
          {optimizedData && (
            <Button
              variant={showOptimized ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOptimized(!showOptimized)}
            >
              {showOptimized ? (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Optimerad version
                </>
              ) : (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Original version
                </>
              )}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={editMode ? handleCancelEdit : () => setEditMode(!editMode)}
            disabled={optimizedData && !showOptimized}
            className={optimizedData && !showOptimized ? "opacity-50 cursor-not-allowed" : ""}
          >
            {editMode ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Avbryt redigering
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Redigeringsläge
              </>
            )}
          </Button>
          {!editMode && (
            <Button
              variant="default"
              size="sm"
              className={`bg-neon-purple hover:bg-neon-purple/80 ${optimizedData && !showOptimized ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={optimizedData && !showOptimized}
            >
              <PDFGenerator
                data={data}
                optimizedData={optimizedData}
                useOptimized={showOptimized && !!optimizedData}
              />
            </Button>
          )}
          {editMode && (
            <Button
              size="sm"
              onClick={handleSaveEdit}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              Spara ändringar
            </Button>
          )}
        </div>
      </div>

      <div className="resume-preview-wrapper">
        <div className="flex justify-center">
          <div className={cn(`resume-container theme-${theme}`)} style={customStyle}>
            {editMode ? (
              // Edit Mode
              <div className="space-y-6">
                <div className={getHeaderClass()}>
                  <div className="space-y-2">                  <Input
                    value={editableData.name || ''}
                    onChange={(e) => handleDataChange('name', e.target.value)}
                    placeholder="Ditt namn"
                    className="text-2xl font-bold border-none px-0 h-auto"
                  />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        value={editableData.email || ''}
                        onChange={(e) => handleDataChange('email', e.target.value)}
                        placeholder="email@example.com"
                        className="border-none px-0 h-auto"
                      />
                      <Input
                        value={editableData.phone || ''}
                        onChange={(e) => handleDataChange('phone', e.target.value)}
                        placeholder="Telefon"
                        className="border-none px-0 h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Professionell sammanfattning</h2>
                  <Textarea
                    value={editableData.summary || ''}
                    onChange={(e) => handleDataChange('summary', e.target.value)}
                    placeholder="Skriv en professionell sammanfattning"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Arbetslivserfarenhet</h2>
                  {editableData.experience?.map((exp, index) => (
                    <div key={index} className="mb-4 border p-3 rounded-md">                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Input
                        value={exp.title}
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                        placeholder="Jobbtitel"
                      />
                      <Input
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        placeholder="Företag"
                      />
                    </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <Input
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                          placeholder="Startdatum"
                        />
                        <Input
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                          placeholder="Slutdatum"
                        />
                      </div>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        placeholder="Beskrivning"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Utbildning</h2>
                  {editableData.education?.map((edu, index) => (
                    <div key={index} className="mb-4 border p-3 rounded-md">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <Input
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          placeholder="Examen"
                        />
                        <Input
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                          placeholder="Institution"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={edu.startDate}
                          onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                          placeholder="Startdatum"
                        />
                        <Input
                          value={edu.endDate}
                          onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                          placeholder="Slutdatum"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Kompetenser</h2>
                  <div className="flex flex-wrap gap-2">
                    {editableData.skills?.map((skill, index) => (
                      <Input
                        key={index}
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        placeholder="Färdighet"
                        className="w-auto"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Preview Mode - Shows optimized data if available
              <div className="space-y-6">
                {showOptimized && optimizedData && (
                  <div className="mb-4 p-3 bg-neon-purple/10 border border-neon-purple/20 rounded-md">
                    <p className="text-sm font-medium text-neon-purple">
                      ✨ Detta är den optimerade versionen av ditt CV, anpassad för jobbeskrivningen
                    </p>
                  </div>
                )}

                <div className={getHeaderClass()}>
                  <h1>{displayData.name}</h1>
                  <div className="contact-info">
                    {displayData.email && <span>{displayData.email}</span>}
                    {displayData.phone && <span>{displayData.phone}</span>}
                    {showOptimized && optimizedData?.personalInfo.linkedin && (
                      <span>{optimizedData.personalInfo.linkedin}</span>
                    )}
                  </div>
                </div>

                {displayData.summary && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      {showOptimized ? 'Profil' : 'Professionell sammanfattning'}
                    </h2>
                    <p className="text-sm leading-relaxed">{displayData.summary}</p>
                  </div>
                )}

                {displayData.experience && displayData.experience.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Arbetslivserfarenhet</h2>
                    {displayData.experience.map((exp, index) => (
                      <div key={index} className="experience-item mb-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{exp.title}</h3>
                          <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-2">{exp.company}</p>
                        <p className="text-sm leading-relaxed">{exp.description}</p>
                        {showOptimized && optimizedData?.workExperience[index]?.keyAchievements && (
                          <div className="mt-3">
                            <ul className="list-disc list-inside text-sm space-y-1">
                              {optimizedData.workExperience[index].keyAchievements.map((achievement, i) => (
                                <li key={i}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {displayData.education && displayData.education.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Utbildning</h2>
                    {displayData.education.map((edu, index) => (
                      <div key={index} className="mb-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{edu.degree}</h3>
                          <span className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</span>
                        </div>
                        <p className="text-sm text-gray-700">{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills Section - Enhanced for optimized data */}
                {displayData.skills && displayData.skills.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Kompetenser</h2>
                    <div className="flex flex-wrap gap-2">
                      {displayData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Skills - Only show for optimized data */}
                {showOptimized && optimizedData?.technicalSkills && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Tekniker</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {optimizedData.technicalSkills.programmingLanguages?.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-1">Programmeringsspråk</h4>
                          <p>{optimizedData.technicalSkills.programmingLanguages.join(', ')}</p>
                        </div>
                      )}
                      {optimizedData.technicalSkills.frameworks?.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-1">Ramverk</h4>
                          <p>{optimizedData.technicalSkills.frameworks.join(', ')}</p>
                        </div>
                      )}
                      {optimizedData.technicalSkills.tools?.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-1">Verktyg</h4>
                          <p>{optimizedData.technicalSkills.tools.join(', ')}</p>
                        </div>
                      )}
                      {optimizedData.technicalSkills.other?.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-1">Övrigt</h4>
                          <p>{optimizedData.technicalSkills.other.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Languages - Only show for optimized data */}
                {showOptimized && optimizedData?.languages && optimizedData.languages.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Språk</h2>
                    <div className="flex flex-wrap gap-3">
                      {optimizedData.languages.map((lang, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{lang.language}</span>
                          <span className="text-muted-foreground"> - {lang.proficiency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;

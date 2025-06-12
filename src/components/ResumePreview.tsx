
import React, { useState } from 'react';
import { Edit, Eye, EyeOff, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { OptimizedResumeData } from '@/types/optimizedResume';

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
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editableData, setEditableData] = useState<ResumeData>(data);
  const [showOptimized, setShowOptimized] = useState<boolean>(!!optimizedData);

  // Use optimized data if available and showOptimized is true
  const displayData = showOptimized && optimizedData ? {
    name: optimizedData.personalInfo.name,
    email: optimizedData.personalInfo.email,
    phone: optimizedData.personalInfo.phone,
    address: optimizedData.personalInfo.address,
    summary: optimizedData.profileSummary,
    experience: optimizedData.workExperience.map(exp => ({
      title: exp.title,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description
    })),
    education: optimizedData.education,
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
  };

  const handleSaveEdit = () => {
    onUpdate(editableData);
    setEditMode(false);
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
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Visningsläge
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Redigeringsläge
              </>
            )}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleDownload}
            className="bg-neon-purple hover:bg-neon-purple/80"
          >
            <Download className="mr-2 h-4 w-4" />
            Ladda ner PDF
          </Button>
          {editMode && (
            <Button
              size="sm"
              onClick={handleSaveEdit}
            >
              <Eye className="mr-2 h-4 w-4" />
              Spara & förhandsgranska
            </Button>
          )}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                    <Input
                      value={editableData.address || ''}
                      onChange={(e) => handleDataChange('address', e.target.value)}
                      placeholder="Ort"
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
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <Input
                        value={exp.location}
                        onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                        placeholder="Ort"
                      />
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
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        value={edu.location}
                        onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                        placeholder="Ort"
                      />
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
                <h2 className="text-lg font-semibold mb-2">Färdigheter</h2>
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
                <h1 className="text-2xl font-bold">{displayData.name}</h1>
                <div className="flex flex-wrap gap-x-4 text-sm">
                  {displayData.email && <p>{displayData.email}</p>}
                  {displayData.phone && <p>{displayData.phone}</p>}
                  {displayData.address && <p>{displayData.address}</p>}
                  {showOptimized && optimizedData?.personalInfo.linkedin && (
                    <p>{optimizedData.personalInfo.linkedin}</p>
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
                    <div key={index} className="mb-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{exp.title}</h3>
                        <span className="text-sm">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <p>{exp.company}</p>
                        <p>{exp.location}</p>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed">{exp.description}</p>
                      {showOptimized && optimizedData?.workExperience[index]?.keyAchievements && (
                        <div className="mt-2">
                          <ul className="list-disc list-inside text-xs space-y-1">
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
                      <div className="flex justify-between">
                        <h3 className="font-medium">{edu.degree}</h3>
                        <span className="text-sm">{edu.startDate} - {edu.endDate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <p>{edu.institution}</p>
                        <p>{edu.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Section - Enhanced for optimized data */}
              {displayData.skills && displayData.skills.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">
                    {showOptimized ? 'Kärnkompetenser' : 'Färdigheter'}
                  </h2>
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
                  <h2 className="text-lg font-semibold mb-3">Tekniska färdigheter</h2>
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
      </Card>
    </div>
  );
};

export default ResumePreview;

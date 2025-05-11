
import React, { useState } from 'react';
import { Edit, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

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
  theme: string;
  color: string;
  onUpdate: (data: ResumeData) => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, theme, color, onUpdate }) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editableData, setEditableData] = useState<ResumeData>(data);
  
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
        <h3 className="text-xl font-medium">Resume Preview</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" /> 
                View Mode
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" /> 
                Edit Mode
              </>
            )}
          </Button>
          {editMode && (
            <Button 
              size="sm"
              onClick={handleSaveEdit}
            >
              <Eye className="mr-2 h-4 w-4" /> 
              Save & Preview
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
                <div className="space-y-2">
                  <Input
                    value={editableData.name || ''}
                    onChange={(e) => handleDataChange('name', e.target.value)}
                    placeholder="Your Name"
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
                      placeholder="Phone"
                      className="border-none px-0 h-auto"
                    />
                    <Input
                      value={editableData.address || ''}
                      onChange={(e) => handleDataChange('address', e.target.value)}
                      placeholder="Location"
                      className="border-none px-0 h-auto"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">Professional Summary</h2>
                <Textarea
                  value={editableData.summary || ''}
                  onChange={(e) => handleDataChange('summary', e.target.value)}
                  placeholder="Write a professional summary"
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">Work Experience</h2>
                {editableData.experience?.map((exp, index) => (
                  <div key={index} className="mb-4 border p-3 rounded-md">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Input
                        value={exp.title}
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                        placeholder="Job Title"
                      />
                      <Input
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        placeholder="Company"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <Input
                        value={exp.location}
                        onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                        placeholder="Location"
                      />
                      <Input
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                        placeholder="Start Date"
                      />
                      <Input
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                        placeholder="End Date"
                      />
                    </div>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">Education</h2>
                {editableData.education?.map((edu, index) => (
                  <div key={index} className="mb-4 border p-3 rounded-md">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Input
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        placeholder="Degree"
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
                        placeholder="Location"
                      />
                      <Input
                        value={edu.startDate}
                        onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                        placeholder="Start Date"
                      />
                      <Input
                        value={edu.endDate}
                        onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                        placeholder="End Date"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {editableData.skills?.map((skill, index) => (
                    <Input
                      key={index}
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      placeholder="Skill"
                      className="w-auto"
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Preview Mode
            <div className="space-y-6">
              <div className={getHeaderClass()}>
                <h1 className="text-2xl font-bold">{editableData.name}</h1>
                <div className="flex flex-wrap gap-x-4 text-sm">
                  {editableData.email && <p>{editableData.email}</p>}
                  {editableData.phone && <p>{editableData.phone}</p>}
                  {editableData.address && <p>{editableData.address}</p>}
                </div>
              </div>
              
              {editableData.summary && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Professional Summary</h2>
                  <p>{editableData.summary}</p>
                </div>
              )}
              
              {editableData.experience && editableData.experience.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Work Experience</h2>
                  {editableData.experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{exp.title}</h3>
                        <span className="text-sm">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <p>{exp.company}</p>
                        <p>{exp.location}</p>
                      </div>
                      <p className="mt-1 text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {editableData.education && editableData.education.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Education</h2>
                  {editableData.education.map((edu, index) => (
                    <div key={index} className="mb-4">
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
              
              {editableData.skills && editableData.skills.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {editableData.skills.map((skill, index) => (
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
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ResumePreview;

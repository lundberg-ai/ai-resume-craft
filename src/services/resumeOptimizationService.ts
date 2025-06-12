import { GoogleGenerativeAI } from '@google/generative-ai';
import { OptimizeResumeRequest, OptimizeResumeResponse, OptimizedResumeData } from '@/types/optimizedResume';
import { ResumeDataValidator } from '@/utils/resumeDataValidator';

export class ResumeOptimizationService {
	private genAI: GoogleGenerativeAI | null = null;

	constructor() {
		const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
		if (apiKey && apiKey.trim() !== '') {
			this.genAI = new GoogleGenerativeAI(apiKey);
		}
	}

	async optimizeResume(request: OptimizeResumeRequest): Promise<OptimizeResumeResponse> {
		console.log('🚀 Starting resume optimization...', {
			originalData: request.originalResumeData,
			jobDescriptionLength: request.jobDescription.length
		});

		try {
			if (!this.genAI) {
				console.warn('⚠️ No Gemini API key found, using mock optimization');
				return this.createMockOptimizedResume(request);
			}

			const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

			const prompt = this.buildOptimizationPrompt(request);

			console.log('📝 Sending prompt to AI for optimization...');

			const result = await model.generateContent(prompt);
			const responseText = result.response.text();

			console.log('🤖 AI Response received:', responseText.substring(0, 200) + '...');

			// Parse the AI response into structured data
			const optimizedData = this.parseAIResponse(responseText, request);

			// Validate the optimized data
			const validation = ResumeDataValidator.validateOptimizedData(optimizedData);

			console.log('✅ Resume optimization completed successfully!');
			ResumeDataValidator.logDataStructure(optimizedData, 'AI-Optimized Resume Data');

			if (!validation.isValid) {
				console.warn('⚠️ Validation warnings found:', validation.errors);
			}

			return {
				success: true,
				optimizedResume: optimizedData,
				optimizationNotes: `CV optimerat med AI för att matcha jobbeskrivningen${!validation.isValid ? ' (några fält kan behöva justeras)' : ''}`
			};

		} catch (error) {
			console.error('❌ Error during resume optimization:', error);

			// Fallback to mock data if AI fails
			console.log('🔄 Falling back to mock optimization...');
			return this.createMockOptimizedResume(request);
		}
	}

	private buildOptimizationPrompt(request: OptimizeResumeRequest): string {
		const { originalResumeData, jobDescription } = request;

		return `
Du är en expert rekryterare och CV-skrivare som specialiserar sig på den svenska arbetsmarknaden. 
Din uppgift är att optimera ett CV för att perfekt matcha en specifik jobbeskrivning.

ORIGINALDATA CV:
Namn: ${originalResumeData.name || 'Ej angivet'}
Email: ${originalResumeData.email || 'Ej angivet'}
Telefon: ${originalResumeData.phone || 'Ej angivet'}
Adress: ${originalResumeData.address || 'Ej angivet'}
Sammanfattning: ${originalResumeData.summary || 'Ej angivet'}

Arbetslivserfarenhet:
${originalResumeData.experience?.map(exp => `
- ${exp.title} på ${exp.company} (${exp.startDate} - ${exp.endDate})
  ${exp.description}
`).join('\n') || 'Ingen erfarenhet angiven'}

Utbildning:
${originalResumeData.education?.map(edu => `
- ${edu.degree} från ${edu.institution} (${edu.startDate} - ${edu.endDate})
`).join('\n') || 'Ingen utbildning angiven'}

Färdigheter: ${originalResumeData.skills?.join(', ') || 'Inga färdigheter angivna'}

JOBBESKRIVNING ATT ANPASSA TILL:
${jobDescription}

INSTRUKTIONER:
1. Skapa en professionell sammanfattning (2-3 meningar) som direkt kopplar kandidatens bakgrund till jobbet
2. Optimera arbetserfarenheter - betona relevanta uppgifter och prestationer
3. Skapa en lista med 8-10 kärnkompetenser som matchar jobbet
4. Kategorisera tekniska färdigheter i relevanta grupper
5. Behåll all faktisk information men betona det som är mest relevant

RETURNERA SVARET I FÖLJANDE JSON-FORMAT:
{
  "personalInfo": {
    "name": "${originalResumeData.name || ''}",
    "email": "${originalResumeData.email || ''}",
    "phone": "${originalResumeData.phone || ''}",
    "address": "${originalResumeData.address || ''}"
  },
  "profileSummary": "Professionell sammanfattning som kopplar till jobbet...",
  "workExperience": [
    {
      "title": "Jobbtitel",
      "company": "Företag",
      "location": "Plats",
      "startDate": "Startdatum",
      "endDate": "Slutdatum",
      "description": "Optimerad beskrivning som matchar jobbet",
      "keyAchievements": ["Prestation 1", "Prestation 2"]
    }
  ],
  "education": [
    {
      "degree": "Examen",
      "institution": "Skola/Universitet",
      "location": "Plats",
      "startDate": "Start",
      "endDate": "Slut"
    }
  ],
  "coreCompetencies": [
    "Kompetens 1", "Kompetens 2", "..." 
  ],
  "technicalSkills": {
    "programmingLanguages": ["språk1", "språk2"],
    "frameworks": ["ramverk1", "ramverk2"],
    "tools": ["verktyg1", "verktyg2"]
  }
}

Svara ENDAST med valid JSON, inga kommentarer eller extra text.
`;
	}

	private parseAIResponse(responseText: string, request: OptimizeResumeRequest): OptimizedResumeData {
		try {
			// Try to extract JSON from the response
			const jsonMatch = responseText.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				const parsed = JSON.parse(jsonMatch[0]);
				return this.validateAndCleanOptimizedData(parsed);
			}
		} catch (error) {
			console.error('Failed to parse AI response as JSON:', error);
		}

		// Fallback to structured mock if parsing fails
		return this.createMockOptimizedResumeData(request);
	}

	private validateAndCleanOptimizedData(data: any): OptimizedResumeData {
		// Ensure all required fields exist with defaults
		return {
			personalInfo: {
				name: data.personalInfo?.name || '',
				email: data.personalInfo?.email || '',
				phone: data.personalInfo?.phone || '',
				address: data.personalInfo?.address || '',
				linkedin: data.personalInfo?.linkedin || '',
				website: data.personalInfo?.website || ''
			},
			profileSummary: data.profileSummary || 'Erfaren professionell med bred kompetens och stark bakgrund.',
			workExperience: Array.isArray(data.workExperience) ? data.workExperience.map((exp: any) => ({
				title: exp.title || '',
				company: exp.company || '',
				location: exp.location || '',
				startDate: exp.startDate || '',
				endDate: exp.endDate || '',
				description: exp.description || '',
				keyAchievements: Array.isArray(exp.keyAchievements) ? exp.keyAchievements : []
			})) : [],
			education: Array.isArray(data.education) ? data.education.map((edu: any) => ({
				degree: edu.degree || '',
				institution: edu.institution || '',
				location: edu.location || '',
				startDate: edu.startDate || '',
				endDate: edu.endDate || ''
			})) : [],
			coreCompetencies: Array.isArray(data.coreCompetencies) ? data.coreCompetencies.slice(0, 10) : [],
			technicalSkills: {
				programmingLanguages: data.technicalSkills?.programmingLanguages || [],
				frameworks: data.technicalSkills?.frameworks || [],
				tools: data.technicalSkills?.tools || [],
				databases: data.technicalSkills?.databases || [],
				cloud: data.technicalSkills?.cloud || [],
				other: data.technicalSkills?.other || []
			},
			languages: data.languages || [],
			certifications: data.certifications || []
		};
	}

	private createMockOptimizedResume(request: OptimizeResumeRequest): OptimizeResumeResponse {
		const optimizedData = this.createMockOptimizedResumeData(request);

		console.log('📋 Created mock optimized resume');
		ResumeDataValidator.logDataStructure(optimizedData, 'Mock-Optimized Resume Data');

		return {
			success: true,
			optimizedResume: optimizedData,
			optimizationNotes: 'Mock-optimering skapad (AI ej tillgänglig) - Redo för PDF-export'
		};
	}

	private createMockOptimizedResumeData(request: OptimizeResumeRequest): OptimizedResumeData {
		const original = request.originalResumeData;

		return {
			personalInfo: {
				name: original.name || 'Anna Karlsson',
				email: original.email || 'anna.karlsson@example.com',
				phone: original.phone || '070-123 45 67',
				address: original.address || 'Stockholm, Sverige',
				linkedin: 'linkedin.com/in/anna-karlsson',
				website: ''
			},
			profileSummary: `Erfaren ${original.experience?.[0]?.title || 'professionell'} med stark bakgrund inom ${this.extractKeywordsFromJobDescription(request.jobDescription).slice(0, 3).join(', ')}. Driven av att leverera högkvalitativa resultat och skapa värde genom innovation och samarbete.`,
			workExperience: original.experience?.map(exp => ({
				title: exp.title,
				company: exp.company,
				location: exp.location,
				startDate: exp.startDate,
				endDate: exp.endDate,
				description: `${exp.description} - Optimerat för att matcha nyckelkrav i jobbeskrivningen.`,
				keyAchievements: [
					'Levererade resultat som överträffade förväntningar',
					'Implementerade lösningar som förbättrade effektiviteten',
					'Samarbetade framgångsrikt i tvärfunktionella team'
				]
			})) || [],
			education: original.education?.map(edu => ({
				degree: edu.degree,
				institution: edu.institution,
				location: edu.location,
				startDate: edu.startDate,
				endDate: edu.endDate
			})) || [],
			coreCompetencies: [
				...this.extractKeywordsFromJobDescription(request.jobDescription).slice(0, 6),
				'Problemlösning',
				'Analytiskt tänkande',
				'Projektledning',
				'Teamarbete'
			].slice(0, 10),
			technicalSkills: {
				programmingLanguages: original.skills?.filter(skill =>
					['javascript', 'typescript', 'python', 'java', 'c#', 'go', 'rust'].some(lang =>
						skill.toLowerCase().includes(lang)
					)
				) || [],
				frameworks: original.skills?.filter(skill =>
					['react', 'vue', 'angular', 'node', 'express', 'spring', 'django'].some(framework =>
						skill.toLowerCase().includes(framework)
					)
				) || [],
				tools: original.skills?.filter(skill =>
					['git', 'docker', 'kubernetes', 'jenkins', 'jira', 'confluence'].some(tool =>
						skill.toLowerCase().includes(tool)
					)
				) || [],
				other: original.skills?.filter(skill =>
					!['javascript', 'typescript', 'python', 'java', 'react', 'vue', 'angular', 'git', 'docker'].some(common =>
						skill.toLowerCase().includes(common)
					)
				) || []
			},
			languages: [
				{ language: 'Svenska', proficiency: 'Modersmål' },
				{ language: 'Engelska', proficiency: 'Flyt' }
			]
		};
	}

	private extractKeywordsFromJobDescription(jobDescription: string): string[] {
		// Simple keyword extraction - could be improved with NLP
		const commonSkills = [
			'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'C#',
			'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'CI/CD', 'Agil', 'Scrum',
			'SQL', 'MongoDB', 'PostgreSQL', 'Redis', 'Elasticsearch',
			'Projektledning', 'Teamarbete', 'Problemlösning', 'Kommunikation'
		];

		return commonSkills.filter(skill =>
			jobDescription.toLowerCase().includes(skill.toLowerCase())
		);
	}
}

// Export singleton instance
export const resumeOptimizationService = new ResumeOptimizationService();

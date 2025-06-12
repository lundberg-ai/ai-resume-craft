// Types for optimized resume data that will be used for PDF generation
export interface OptimizedResumeData {
	// Personal Information
	personalInfo: {
		name: string;
		email?: string;
		phone?: string;
		address?: string;
		linkedin?: string;
		website?: string;
	};

	// Professional Summary/Profile - tailored to the job
	profileSummary: string;

	// Work Experience - optimized and tailored
	workExperience: WorkExperience[];

	// Education
	education: Education[];

	// Core Competencies - focused bullets matching job requirements
	coreCompetencies: string[]; // Max 10 focused bullet points

	// Technical Skills categorized
	technicalSkills: {
		programmingLanguages?: string[];
		frameworks?: string[];
		tools?: string[];
		databases?: string[];
		cloud?: string[];
		other?: string[];
	};

	// Languages (if relevant)
	languages?: Language[];

	// Certifications (if relevant)
	certifications?: Certification[];
}

export interface WorkExperience {
	title: string;
	company: string;
	location: string;
	startDate: string;
	endDate: string;
	description: string; // AI-optimized description matching job requirements
	keyAchievements: string[]; // 2-4 key achievements with metrics if possible
}

export interface Education {
	degree: string;
	institution: string;
	location: string;
	startDate: string;
	endDate: string;
	gpa?: string;
	relevantCoursework?: string[];
}

export interface Language {
	language: string;
	proficiency: 'Grundläggande' | 'Goda kunskaper' | 'Flyt' | 'Modersmål';
}

export interface Certification {
	name: string;
	issuer: string;
	date: string;
	expirationDate?: string;
	credentialId?: string;
}

// API Request/Response types
export interface OptimizeResumeRequest {
	originalResumeData: {
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
	};
	jobDescription: string;
}

export interface OptimizeResumeResponse {
	success: boolean;
	optimizedResume: OptimizedResumeData;
	optimizationNotes?: string;
	error?: string;
}

// For development/testing - mock data structure
export interface MockOptimizedData extends OptimizedResumeData {
	_meta: {
		optimizedAt: string;
		jobDescriptionLength: number;
		optimizationStrategy: string;
	};
}

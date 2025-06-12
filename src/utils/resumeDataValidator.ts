import { OptimizedResumeData } from '@/types/optimizedResume';

/**
 * Utility functions for debugging and validating resume data
 */
export class ResumeDataValidator {

	/**
	 * Validates that the optimized resume data has all required fields for PDF generation
	 */
	static validateOptimizedData(data: OptimizedResumeData): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];

		// Check required personal info
		if (!data.personalInfo.name?.trim()) {
			errors.push('Personal info: Name is required');
		}

		// Check profile summary
		if (!data.profileSummary?.trim()) {
			errors.push('Profile summary is required');
		}

		// Check work experience
		if (!data.workExperience || data.workExperience.length === 0) {
			errors.push('At least one work experience is required');
		} else {
			data.workExperience.forEach((exp, index) => {
				if (!exp.title?.trim()) errors.push(`Work experience ${index + 1}: Title is required`);
				if (!exp.company?.trim()) errors.push(`Work experience ${index + 1}: Company is required`);
				if (!exp.description?.trim()) errors.push(`Work experience ${index + 1}: Description is required`);
			});
		}

		// Check education
		if (!data.education || data.education.length === 0) {
			errors.push('At least one education entry is required');
		} else {
			data.education.forEach((edu, index) => {
				if (!edu.degree?.trim()) errors.push(`Education ${index + 1}: Degree is required`);
				if (!edu.institution?.trim()) errors.push(`Education ${index + 1}: Institution is required`);
			});
		}

		// Check core competencies
		if (!data.coreCompetencies || data.coreCompetencies.length === 0) {
			errors.push('Core competencies are required');
		}

		return {
			isValid: errors.length === 0,
			errors
		};
	}

	/**
	 * Logs a comprehensive overview of the resume data structure
	 */
	static logDataStructure(data: OptimizedResumeData, label: string = 'Resume Data') {
		console.group(`📊 ${label} Structure Overview`);

		console.log('👤 Personal Information:');
		console.table(data.personalInfo);

		console.log('📝 Profile Summary:');
		console.log(`"${data.profileSummary}"`);
		console.log(`Length: ${data.profileSummary?.length || 0} characters`);

		console.log('💼 Work Experience:');
		data.workExperience?.forEach((exp, index) => {
			console.log(`\n${index + 1}. ${exp.title} at ${exp.company}`);
			console.log(`   Period: ${exp.startDate} - ${exp.endDate}`);
			console.log(`   Description: ${exp.description?.substring(0, 100)}...`);
			if (exp.keyAchievements?.length > 0) {
				console.log(`   Key Achievements: ${exp.keyAchievements.length} items`);
			}
		});

		console.log('\n🎓 Education:');
		data.education?.forEach((edu, index) => {
			console.log(`${index + 1}. ${edu.degree} from ${edu.institution} (${edu.startDate} - ${edu.endDate})`);
		});

		console.log('\n🔧 Core Competencies:');
		console.log(data.coreCompetencies?.join(', '));

		console.log('\n💻 Technical Skills:');
		console.table(data.technicalSkills);

		if (data.languages?.length > 0) {
			console.log('\n🌍 Languages:');
			console.table(data.languages);
		}

		if (data.certifications?.length > 0) {
			console.log('\n🏆 Certifications:');
			console.table(data.certifications);
		}

		// Validation summary
		const validation = this.validateOptimizedData(data);
		console.log('\n✅ Validation Result:');
		console.log(`Valid for PDF generation: ${validation.isValid}`);
		if (!validation.isValid) {
			console.log('❌ Errors found:');
			validation.errors.forEach(error => console.log(`  - ${error}`));
		}

		console.groupEnd();
	}

	/**
	 * Returns a PDF-ready data summary for debugging
	 */
	static getPDFReadySummary(data: OptimizedResumeData) {
		return {
			readyForPDF: this.validateOptimizedData(data).isValid,
			sections: {
				personalInfo: !!data.personalInfo.name,
				profileSummary: !!data.profileSummary,
				workExperience: data.workExperience?.length > 0,
				education: data.education?.length > 0,
				coreCompetencies: data.coreCompetencies?.length > 0,
				technicalSkills: Object.keys(data.technicalSkills || {}).length > 0,
				languages: data.languages?.length > 0,
				certifications: data.certifications?.length > 0
			},
			stats: {
				totalWorkExperience: data.workExperience?.length || 0,
				totalEducation: data.education?.length || 0,
				totalCompetencies: data.coreCompetencies?.length || 0,
				profileSummaryLength: data.profileSummary?.length || 0
			}
		};
	}
}

/**
 * Helper function to quickly log resume data in console
 */
export const debugResumeData = (data: OptimizedResumeData, label?: string) => {
	ResumeDataValidator.logDataStructure(data, label);
};

/**
 * Helper function to check if data is ready for PDF generation
 */
export const isReadyForPDF = (data: OptimizedResumeData): boolean => {
	return ResumeDataValidator.validateOptimizedData(data).isValid;
};

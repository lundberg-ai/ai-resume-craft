/**
 * Resume text parser - extracts structured data from resume text
 */

export interface ParsedResumeData {
	name?: string;
	email?: string;
	phone?: string;
	address?: string;
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

export class ResumeTextParser {

	/**
	 * Parses resume text and extracts structured data
	 */
	static parseResumeText(text: string): ParsedResumeData {
		console.log('🔍 Parsing resume text...', text.substring(0, 200) + '...');

		const result: ParsedResumeData = {};

		// Extract basic contact information
		result.name = this.extractName(text);
		result.email = this.extractEmail(text);
		result.phone = this.extractPhone(text);
		result.address = this.extractAddress(text);

		// Extract profile/summary
		result.summary = this.extractSummary(text);

		// Extract work experience
		result.experience = this.extractExperience(text);

		// Extract education
		result.education = this.extractEducation(text);

		// Extract skills
		result.skills = this.extractSkills(text);

		console.log('✅ Parsed resume data:', result);
		console.log('📊 Summary:', {
			name: result.name,
			email: result.email,
			phone: result.phone,
			experienceCount: result.experience?.length || 0,
			educationCount: result.education?.length || 0,
			skillsCount: result.skills?.length || 0
		});

		return result;
	}

	private static extractName(text: string): string {
		// Look for name at the beginning of the text
		const lines = text.split('\n').filter(line => line.trim());

		// The name is likely in the first few lines
		for (const line of lines.slice(0, 5)) {
			const trimmed = line.trim();

			// Skip empty lines and common headers
			if (!trimmed ||
				trimmed.toLowerCase().includes('cv') ||
				trimmed.toLowerCase().includes('resume') ||
				trimmed.toLowerCase().includes('developer') ||
				trimmed.toLowerCase().includes('profil')) {
				continue;
			}

			// Check if it looks like a name (2-3 words, capitalized)
			const words = trimmed.split(/\s+/);
			if (words.length >= 2 && words.length <= 3) {
				if (words.every(word => /^[A-ZÅÄÖ][a-zåäö]+$/.test(word))) {
					return trimmed;
				}
			}
		}

		return 'Okänd namn';
	}

	private static extractEmail(text: string): string {
		const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
		const match = text.match(emailRegex);
		return match ? match[1] : '';
	}

	private static extractPhone(text: string): string {
		// Swedish phone number patterns
		const phoneRegex = /(\+46\s?[0-9\s-]{8,15}|0[0-9\s-]{8,12})/;
		const match = text.match(phoneRegex);
		return match ? match[1].replace(/\s+/g, '') : '';
	}

	private static extractAddress(text: string): string {
		// Look for Swedish cities or general location info
		const swedishCities = ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Luleå', 'Linköping', 'Örebro', 'Västerås', 'Helsingborg', 'Norrköping'];

		for (const city of swedishCities) {
			if (text.includes(city)) {
				return `${city}, Sverige`;
			}
		}

		return '';
	}

	private static extractSummary(text: string): string {
		// Look for profile section
		const profileMatch = text.match(/Profil\s*([\s\S]*?)(?=\n\s*[A-ZÅÄÖ][a-zåäö]+\s*\n|\n\s*•|\n\s*\d+|$)/i);

		if (profileMatch) {
			return profileMatch[1].trim().replace(/\s+/g, ' ');
		}

		// Fallback: look for a descriptive paragraph near the beginning
		const lines = text.split('\n');
		for (let i = 0; i < Math.min(lines.length, 15); i++) {
			const line = lines[i].trim();
			if (line.length > 50 && line.includes('Developer') || line.includes('utvecklare')) {
				let summary = line;
				// Include next few lines if they seem to continue the description
				for (let j = i + 1; j < Math.min(lines.length, i + 4); j++) {
					const nextLine = lines[j].trim();
					if (nextLine.length > 20 && !nextLine.match(/^[A-ZÅÄÖ\d]/)) {
						summary += ' ' + nextLine;
					} else {
						break;
					}
				}
				return summary.replace(/\s+/g, ' ');
			}
		}

		return '';
	}

	private static extractExperience(text: string): Array<{
		title: string;
		company: string;
		startDate: string;
		endDate: string;
		description: string;
	}> {
		const experiences: any[] = [];

		// Look for work experience section
		const workSectionMatch = text.match(/Arbetslivserfarenhet\s*([\s\S]*?)(?=Utbildning|$)/i);

		if (!workSectionMatch) {
			return experiences;
		}

		const workSection = workSectionMatch[1];
		console.log('📋 Work section found:', workSection.substring(0, 200) + '...');

		// Look for patterns like "2025 –" followed by company and title
		const entryPattern = /(\d{4})\s*[–-]\s*(\d{4}|[^\n]*)\s*\n([^\n]+)\s*\n([^\n]+)\s*([\s\S]*?)(?=\d{4}\s*[–-]|$)/g;

		let match;
		while ((match = entryPattern.exec(workSection)) !== null) {
			const startYear = match[1];
			const endInfo = match[2].trim();
			const company = match[3].trim();
			const title = match[4].trim();
			const description = match[5].trim().replace(/\s+/g, ' ');

			// Determine end date
			let endDate = 'Nuvarande';
			if (/^\d{4}$/.test(endInfo)) {
				endDate = endInfo;
			}

			experiences.push({
				title,
				company,
				startDate: startYear,
				endDate,
				description
			});
		}

		console.log(`📊 Extracted ${experiences.length} work experiences:`, experiences);
		return experiences;
	}

	private static extractEducation(text: string): Array<{
		degree: string;
		institution: string;
		startDate: string;
		endDate: string;
	}> {
		const education: any[] = [];

		// Look for education section
		const eduSectionMatch = text.match(/Utbildning\s*([\s\S]*?)$/i);

		if (!eduSectionMatch) {
			return education;
		}

		const eduSection = eduSectionMatch[1];
		console.log('🎓 Education section found:', eduSection.substring(0, 200) + '...');

		// Look for patterns like "2024 – 2025" followed by institution and degree
		const entryPattern = /(\d{4})\s*[–-]\s*(\d{4}|[^\n]*)\s*\n([^\n]+)\s*\n([^\n]+)\s*([\s\S]*?)(?=\d{4}\s*[–-]|$)/g;

		let match;
		while ((match = entryPattern.exec(eduSection)) !== null) {
			const startYear = match[1];
			const endInfo = match[2].trim();
			const institution = match[3].trim();
			const degree = match[4].trim();

			// Determine end date
			let endDate = startYear; // Default for single year entries
			if (/^\d{4}$/.test(endInfo)) {
				endDate = endInfo;
			}

			education.push({
				degree,
				institution,
				startDate: startYear,
				endDate
			});
		}

		console.log(`📊 Extracted ${education.length} education entries:`, education);
		return education;
	}

	private static extractSkills(text: string): string[] {
		const skills: string[] = [];

		// Look for skills in bullet points
		const bulletMatches = text.match(/•\s*([^\n•]+)/g);

		if (bulletMatches) {
			bulletMatches.forEach(match => {
				const skill = match.replace(/•\s*/, '').trim();
				if (skill && skill.length > 1) {
					// Split compound skills (e.g., "React, Vite, JavaScript")
					if (skill.includes(',')) {
						skill.split(',').forEach(s => {
							const trimmed = s.trim();
							if (trimmed) skills.push(trimmed);
						});
					} else {
						skills.push(skill);
					}
				}
			});
		}

		// Also look for parenthetical skills (e.g., "(React, Node.js)")
		const parenMatches = text.match(/\(([^)]+)\)/g);
		if (parenMatches) {
			parenMatches.forEach(match => {
				const content = match.replace(/[()]/g, '').trim();
				if (content.includes(',')) {
					content.split(',').forEach(skill => {
						const trimmed = skill.trim();
						if (trimmed && !skills.includes(trimmed)) {
							skills.push(trimmed);
						}
					});
				}
			});
		}

		return [...new Set(skills)]; // Remove duplicates
	}

	private static parseDateRange(dateRange: string): [string, string] {
		const cleanRange = dateRange.replace(/\s+/g, ' ').trim();

		if (cleanRange.includes('–') || cleanRange.includes('-')) {
			const parts = cleanRange.split(/[–-]/).map(p => p.trim());
			const start = parts[0] || '';
			const end = parts[1] || 'Nuvarande';
			return [start, end];
		}

		return [cleanRange, 'Nuvarande'];
	}
}

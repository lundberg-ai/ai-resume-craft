import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { OptimizedResumeData } from '@/types/optimizedResume';

// Register fonts (optional - uses default fonts if not registered)
// Font.register({
//   family: 'Open Sans',
//   src: 'https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0bf8pkAp6a.woff2'
// });

// Create styles for A4 PDF with proper proportions
const styles = StyleSheet.create({
	page: {
		flexDirection: 'column',
		backgroundColor: '#FFFFFF',
		fontFamily: 'Helvetica',
		fontSize: 10,
		lineHeight: 1.4,
		paddingTop: 40,
		paddingBottom: 40,
		paddingHorizontal: 40,
	},
	header: {
		marginBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E7EB',
		paddingBottom: 15,
	},
	name: {
		fontSize: 26,
		fontWeight: 'bold',
		marginBottom: 8,
		color: '#1F2937',
	},
	contactInfo: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 15,
		fontSize: 9,
		color: '#6B7280',
	},
	contactItem: {
		marginRight: 15,
	},
	section: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 10,
		color: '#374151',
		borderBottomWidth: 0.5,
		borderBottomColor: '#D1D5DB',
		paddingBottom: 4,
	},
	profileSummary: {
		fontSize: 10,
		lineHeight: 1.6,
		color: '#4B5563',
		textAlign: 'justify',
	},
	experienceItem: {
		marginBottom: 14,
	},
	experienceHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4,
	},
	jobTitle: {
		fontSize: 12,
		fontWeight: 'bold',
		color: '#1F2937',
	},
	dateRange: {
		fontSize: 9,
		color: '#6B7280',
	},
	companyInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 6,
	},
	company: {
		fontSize: 10,
		fontWeight: 'bold',
		color: '#374151',
	},
	location: {
		fontSize: 9,
		color: '#6B7280',
	},
	description: {
		fontSize: 9,
		lineHeight: 1.5,
		color: '#4B5563',
		marginBottom: 4,
	},
	achievements: {
		marginTop: 6,
	},
	achievement: {
		fontSize: 8,
		lineHeight: 1.4,
		color: '#374151',
		marginBottom: 3,
		paddingLeft: 10,
	},
	skillsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	skillChip: {
		backgroundColor: '#F3F4F6',
		borderRadius: 12,
		paddingHorizontal: 10,
		paddingVertical: 4,
		fontSize: 8,
		color: '#374151',
		marginBottom: 4,
	},
	technicalSkillsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 15,
	},
	technicalSkillCategory: {
		flex: 1,
		minWidth: '45%',
		marginBottom: 10,
	},
	categoryTitle: {
		fontSize: 9,
		fontWeight: 'bold',
		color: '#374151',
		marginBottom: 4,
	},
	categoryContent: {
		fontSize: 8,
		color: '#4B5563',
		lineHeight: 1.4,
	},
	languageItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 4,
	},
	languageName: {
		fontSize: 9,
		color: '#374151',
	},
	languageLevel: {
		fontSize: 8,
		color: '#6B7280',
	},
	educationItem: {
		marginBottom: 10,
	},
	educationHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 2,
	},
	degree: {
		fontSize: 10,
		fontWeight: 'bold',
		color: '#1F2937',
	},
	institution: {
		fontSize: 9,
		color: '#374151',
	},
});

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

interface PDFGeneratorProps {
	data: ResumeData;
	optimizedData?: OptimizedResumeData | null;
	useOptimized?: boolean;
	fileName?: string;
}

// PDF Document Component
const ResumeDocument: React.FC<{ data: ResumeData; optimizedData?: OptimizedResumeData | null; useOptimized?: boolean }> = ({
	data,
	optimizedData,
	useOptimized = false
}) => {
	// Use optimized data if available and requested
	const displayData = useOptimized && optimizedData ? {
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

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.name}>{displayData.name || 'Namn'}</Text>
					<View style={styles.contactInfo}>
						{displayData.email && (
							<Text style={styles.contactItem}>{displayData.email}</Text>
						)}
						{displayData.phone && (
							<Text style={styles.contactItem}>{displayData.phone}</Text>
						)}
						{useOptimized && optimizedData?.personalInfo.linkedin && (
							<Text style={styles.contactItem}>{optimizedData.personalInfo.linkedin}</Text>
						)}
					</View>
				</View>

				{/* Profile Summary */}
				{displayData.summary && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>
							{useOptimized ? 'Profil' : 'Professionell sammanfattning'}
						</Text>
						<Text style={styles.profileSummary}>{displayData.summary}</Text>
					</View>
				)}

				{/* Work Experience */}
				{displayData.experience && displayData.experience.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Arbetslivserfarenhet</Text>
						{displayData.experience.map((exp, index) => (
							<View key={index} style={styles.experienceItem}>
								<View style={styles.experienceHeader}>
									<Text style={styles.jobTitle}>{exp.title}</Text>
									<Text style={styles.dateRange}>{exp.startDate} - {exp.endDate}</Text>
								</View>
								<Text style={styles.company}>{exp.company}</Text>
								<Text style={styles.description}>{exp.description}</Text>
								{useOptimized && optimizedData?.workExperience[index]?.keyAchievements && (
									<View style={styles.achievements}>
										{optimizedData.workExperience[index].keyAchievements.map((achievement, i) => (
											<Text key={i} style={styles.achievement}>• {achievement}</Text>
										))}
									</View>
								)}
							</View>
						))}
					</View>
				)}

				{/* Education */}
				{displayData.education && displayData.education.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Utbildning</Text>
						{displayData.education.map((edu, index) => (
							<View key={index} style={styles.educationItem}>
								<View style={styles.educationHeader}>
									<Text style={styles.degree}>{edu.degree}</Text>
									<Text style={styles.dateRange}>{edu.startDate} - {edu.endDate}</Text>
								</View>
								<Text style={styles.institution}>{edu.institution}</Text>
							</View>
						))}
					</View>
				)}

				{/* Core Competencies/Skills */}
				{displayData.skills && displayData.skills.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>
							{useOptimized ? 'Kärnkompetenser' : 'Färdigheter'}
						</Text>
						<View style={styles.skillsContainer}>
							{displayData.skills.map((skill, index) => (
								<Text key={index} style={styles.skillChip}>{skill}</Text>
							))}
						</View>
					</View>
				)}

				{/* Technical Skills - Only for optimized data */}
				{useOptimized && optimizedData?.technicalSkills && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Tekniska färdigheter</Text>
						<View style={styles.technicalSkillsGrid}>
							{optimizedData.technicalSkills.programmingLanguages && optimizedData.technicalSkills.programmingLanguages.length > 0 && (
								<View style={styles.technicalSkillCategory}>
									<Text style={styles.categoryTitle}>Programmeringsspråk</Text>
									<Text style={styles.categoryContent}>{optimizedData.technicalSkills.programmingLanguages.join(', ')}</Text>
								</View>
							)}
							{optimizedData.technicalSkills.frameworks && optimizedData.technicalSkills.frameworks.length > 0 && (
								<View style={styles.technicalSkillCategory}>
									<Text style={styles.categoryTitle}>Ramverk</Text>
									<Text style={styles.categoryContent}>{optimizedData.technicalSkills.frameworks.join(', ')}</Text>
								</View>
							)}
							{optimizedData.technicalSkills.tools && optimizedData.technicalSkills.tools.length > 0 && (
								<View style={styles.technicalSkillCategory}>
									<Text style={styles.categoryTitle}>Verktyg</Text>
									<Text style={styles.categoryContent}>{optimizedData.technicalSkills.tools.join(', ')}</Text>
								</View>
							)}
							{optimizedData.technicalSkills.other && optimizedData.technicalSkills.other.length > 0 && (
								<View style={styles.technicalSkillCategory}>
									<Text style={styles.categoryTitle}>Övrigt</Text>
									<Text style={styles.categoryContent}>{optimizedData.technicalSkills.other.join(', ')}</Text>
								</View>
							)}
						</View>
					</View>
				)}

				{/* Languages - Only for optimized data */}
				{useOptimized && optimizedData?.languages && optimizedData.languages.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Språk</Text>
						{optimizedData.languages.map((lang, index) => (
							<View key={index} style={styles.languageItem}>
								<Text style={styles.languageName}>{lang.language}</Text>
								<Text style={styles.languageLevel}>{lang.proficiency}</Text>
							</View>
						))}
					</View>
				)}

				{/* Certifications - Only for optimized data */}
				{useOptimized && optimizedData?.certifications && optimizedData.certifications.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Certifieringar</Text>
						{optimizedData.certifications.map((cert, index) => (
							<View key={index} style={styles.educationItem}>
								<View style={styles.educationHeader}>
									<Text style={styles.degree}>{cert.name}</Text>
									<Text style={styles.dateRange}>{cert.date}</Text>
								</View>
								<Text style={styles.institution}>{cert.issuer}</Text>
							</View>
						))}
					</View>
				)}
			</Page>
		</Document>
	);
};

// Main PDF Generator Component
const PDFGenerator: React.FC<PDFGeneratorProps> = ({
	data,
	optimizedData,
	useOptimized = false,
	fileName = 'cv'
}) => {
	const generateFileName = () => {
		const name = useOptimized && optimizedData ? optimizedData.personalInfo.name : data.name;
		const cleanName = name?.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || 'cv';
		const suffix = useOptimized ? '_optimerad' : '';
		return `${cleanName}${suffix}.pdf`;
	};

	return (
		<PDFDownloadLink
			document={<ResumeDocument data={data} optimizedData={optimizedData} useOptimized={useOptimized} />}
			fileName={generateFileName()}
		>
			{({ blob, url, loading, error }) => (
				<span>
					{loading ? 'Genererar PDF...' : 'Ladda ner PDF'}
				</span>
			)}
		</PDFDownloadLink>
	);
};

export default PDFGenerator;

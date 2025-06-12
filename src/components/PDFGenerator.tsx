import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { OptimizedResumeData } from '@/types/optimizedResume';

// Create styles for A4 PDF matching the preview
const styles = StyleSheet.create({
	page: {
		flexDirection: 'column',
		backgroundColor: '#FFFFFF',
		fontFamily: 'Helvetica',
		fontSize: 11,
		lineHeight: 1.4,
		paddingTop: 56.69, // 2cm
		paddingBottom: 56.69, // 2cm
		paddingHorizontal: 56.69, // 2cm
	},
	header: {
		marginBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0',
		paddingBottom: 12,
	},
	name: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 8,
		color: '#1A1A1A',
	},
	contactInfo: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 15,
		fontSize: 10,
		color: '#666666',
		marginBottom: 12,
	},
	contactItem: {
		marginRight: 15,
	},
	section: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: '600',
		marginBottom: 6,
		marginTop: 16,
		color: '#2D2D2D',
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0',
		paddingBottom: 3,
	},
	profileSummary: {
		fontSize: 11,
		lineHeight: 1.6,
		color: '#4B5563',
		textAlign: 'justify',
	},
	experienceItem: {
		marginBottom: 16,
	},
	experienceHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 4,
	},
	jobTitle: {
		fontSize: 12,
		fontWeight: '500',
		color: '#1A1A1A',
		flex: 1,
	},
	dateRange: {
		fontSize: 10,
		color: '#666666',
		textAlign: 'right',
	},
	company: {
		fontSize: 10,
		fontWeight: 'bold',
		color: '#666666',
		marginBottom: 6,
	},
	description: {
		fontSize: 11,
		lineHeight: 1.5,
		color: '#4B5563',
		marginBottom: 4,
		textAlign: 'justify',
	},
	achievements: {
		marginTop: 6,
	},
	achievement: {
		fontSize: 10,
		lineHeight: 1.4,
		color: '#374151',
		marginBottom: 3,
		paddingLeft: 10,
	},
	skillsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 6,
	},
	skillChip: {
		backgroundColor: '#F3F4F6',
		borderRadius: 12,
		paddingHorizontal: 10,
		paddingVertical: 4,
		fontSize: 9,
		color: '#374151',
		marginBottom: 4,
		marginRight: 6,
	},
	technicalSkillsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 15,
	},
	technicalSkillCategory: {
		flex: 1,
		minWidth: '45%',
		marginBottom: 12,
	},
	categoryTitle: {
		fontSize: 10,
		fontWeight: 'bold',
		color: '#374151',
		marginBottom: 4,
	},
	categoryContent: {
		fontSize: 10,
		color: '#4B5563',
		lineHeight: 1.4,
	},
	languageItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 6,
		alignItems: 'center',
	},
	languageName: {
		fontSize: 10,
		fontWeight: 'bold',
		color: '#374151',
	},
	languageProficiency: {
		fontSize: 10,
		color: '#6B7280',
	},
	educationItem: {
		marginBottom: 12,
	},
	educationHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 4,
	},
	degree: {
		fontSize: 12,
		fontWeight: '500',
		color: '#1A1A1A',
		flex: 1,
	},
	institution: {
		fontSize: 10,
		color: '#666666',
		marginBottom: 2,
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

// PDF Document Component with proper page break handling
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
				{/* Header - unwrappable section */}
				<View style={styles.header} wrap={false}>
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

				{/* Profile Summary - unwrappable section */}
				{displayData.summary && (
					<View style={styles.section} wrap={false}>
						<Text style={styles.sectionTitle}>
							{useOptimized ? 'Profil' : 'Professionell sammanfattning'}
						</Text>
						<Text style={styles.profileSummary}>{displayData.summary}</Text>
					</View>
				)}

				{/* Work Experience - each item unwrappable */}
				{displayData.experience && displayData.experience.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Arbetslivserfarenhet</Text>
						{displayData.experience.map((exp, index) => (
							<View key={index} style={styles.experienceItem} wrap={false}>
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

				{/* Education - each item unwrappable */}
				{displayData.education && displayData.education.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Utbildning</Text>
						{displayData.education.map((edu, index) => (
							<View key={index} style={styles.educationItem} wrap={false}>
								<View style={styles.educationHeader}>
									<Text style={styles.degree}>{edu.degree}</Text>
									<Text style={styles.dateRange}>{edu.startDate} - {edu.endDate}</Text>
								</View>
								<Text style={styles.institution}>{edu.institution}</Text>
							</View>
						))}
					</View>
				)}

				{/* Core Competencies/Skills - unwrappable section */}
				{displayData.skills && displayData.skills.length > 0 && (
					<View style={styles.section} wrap={false}>
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

				{/* Technical Skills - unwrappable section for optimized data */}
				{useOptimized && optimizedData?.technicalSkills && (
					<View style={styles.section} wrap={false}>
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

				{/* Languages - unwrappable section for optimized data */}
				{useOptimized && optimizedData?.languages && optimizedData.languages.length > 0 && (
					<View style={styles.section} wrap={false}>
						<Text style={styles.sectionTitle}>Språk</Text>
						{optimizedData.languages.map((lang, index) => (
							<View key={index} style={styles.languageItem}>
								<Text style={styles.languageName}>{lang.language}</Text>
								<Text style={styles.languageProficiency}>{lang.proficiency}</Text>
							</View>
						))}
					</View>
				)}

				{/* Certifications - each item unwrappable for optimized data */}
				{useOptimized && optimizedData?.certifications && optimizedData.certifications.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Certifieringar</Text>
						{optimizedData.certifications.map((cert, index) => (
							<View key={index} style={styles.educationItem} wrap={false}>
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

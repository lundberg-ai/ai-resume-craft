/**
 * Get the Gemini API key with priority:
 * 1. User's personal key from localStorage
 * 2. Environment variable key as fallback
 * 
 * @returns The API key to use, or null if none available
 */
export const getGeminiApiKey = (): string | null => {
	// First priority: Check localStorage for user's personal key
	const userApiKey = localStorage.getItem('gemini_api_key');
	if (userApiKey && userApiKey.trim() !== '') {
		return userApiKey.trim();
	}

	// Second priority: Use environment variable as fallback
	const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
	if (envApiKey && envApiKey.trim() !== '') {
		return envApiKey.trim();
	}

	// No API key available
	return null;
};

/**
 * Check if user has set their own API key
 * @returns true if user has set their own key
 */
export const hasUserApiKey = (): boolean => {
	const userApiKey = localStorage.getItem('gemini_api_key');
	return userApiKey !== null && userApiKey.trim() !== '';
};

/**
 * Check if environment API key is available
 * @returns true if environment key exists
 */
export const hasEnvApiKey = (): boolean => {
	const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
	return envApiKey !== undefined && envApiKey.trim() !== '';
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
	const { theme, toggleTheme } = useTheme();

	return (<Button
		variant="ghost"
		size="icon"
		onClick={toggleTheme}
		className="hover:bg-neon-purple/10 transition-colors"
		aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
	>
		{theme === 'light' ? (
			<Moon className="h-5 w-5" />
		) : (
			<Sun className="h-5 w-5" />
		)}
	</Button>
	);
};

export default ThemeToggle;

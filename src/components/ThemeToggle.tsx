
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleTheme}
			className="border-2 border-black dark:border-white hover:border-neon-purple dark:hover:border-neon-purple transition-colors"
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

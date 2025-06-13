import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface SettingsToggleProps {
	onClick: () => void;
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({ onClick }) => {
	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={onClick}
			className="hover:bg-neon-purple/10 transition-colors"
			aria-label="Settings"
		>
			<Settings className="h-5 w-5" />
		</Button>
	);
};

export default SettingsToggle;

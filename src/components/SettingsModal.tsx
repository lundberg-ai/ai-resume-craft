import React, { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Save, Trash2, Eye, EyeOff } from 'lucide-react';

interface SettingsModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
	const [apiKey, setApiKey] = useState('');
	const [showApiKey, setShowApiKey] = useState(false);
	const [savedMessage, setSavedMessage] = useState(false);

	useEffect(() => {
		// Load existing API key from localStorage when modal opens
		if (open) {
			const savedKey = localStorage.getItem('gemini_api_key');
			if (savedKey) {
				setApiKey(savedKey);
			}
		}
	}, [open]);

	const handleSave = () => {
		if (apiKey.trim()) {
			localStorage.setItem('gemini_api_key', apiKey.trim());
			setSavedMessage(true);
			setTimeout(() => setSavedMessage(false), 3000);
		}
	};

	const handleClear = () => {
		localStorage.removeItem('gemini_api_key');
		setApiKey('');
		setSavedMessage(true);
		setTimeout(() => setSavedMessage(false), 3000);
	};

	const hasLocalKey = localStorage.getItem('gemini_api_key');
	const hasEnvKey = import.meta.env.VITE_GEMINI_API_KEY;
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md bg-white dark:bg-[#212121]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						Inställningar
					</DialogTitle>
					<DialogDescription>
						Hantera din Gemini AI API-nyckel för förbättrad jobbeskrivningsanalys.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Current Status */}
					<Alert>
						<AlertDescription>
							<strong>Nuvarande status:</strong>{' '}
							{hasLocalKey ? (
								<span className="text-green-600 dark:text-green-400">
									Använder din personliga API-nyckel
								</span>
							) : hasEnvKey ? (
								<span className="text-yellow-600 dark:text-yellow-400">
									Använder delad API-nyckel (begränsad kapacitet)
								</span>
							) : (
								<span className="text-red-600 dark:text-red-400">
									Ingen API-nyckel tillgänglig
								</span>
							)}
						</AlertDescription>
					</Alert>

					{/* Instructions */}
					<div className="space-y-3">
						<Label htmlFor="api-key">Google Gemini API-nyckel</Label>
						<div className="text-sm text-muted-foreground space-y-2">
							<p>Få din gratis API-nyckel från Google AI Studio:</p>
							<ol className="list-decimal list-inside space-y-1 text-xs">
								<li>Besök Google AI Studio</li>
								<li>Logga in med ditt Google-konto</li>
								<li>Klicka på "Create API Key"</li>
								<li>Kopiera nyckeln och klistra in den nedan</li>
							</ol>
							<Button
								variant="outline"
								size="sm"
								className="w-full mt-2"
								onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}
							>
								<ExternalLink className="h-4 w-4 mr-2" />
								Öppna Google AI Studio
							</Button>
						</div>
					</div>

					{/* API Key Input */}
					<div className="space-y-2">
						<div className="relative">
							<Input
								id="api-key"
								type={showApiKey ? "text" : "password"}
								placeholder="AIzaSy... (din API-nyckel)"
								value={apiKey}
								onChange={(e) => setApiKey(e.target.value)}
								className="pr-10"
							/>
							<Button
								variant="ghost"
								size="sm"
								className="absolute right-1 top-1 h-8 w-8 p-0"
								onClick={() => setShowApiKey(!showApiKey)}
							>
								{showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</Button>
						</div>
					</div>

					{/* Success Message */}
					{savedMessage && (
						<Alert>
							<AlertDescription className="text-green-600 dark:text-green-400">
								Inställningar sparade!
							</AlertDescription>
						</Alert>
					)}

					{/* Action Buttons */}
					<div className="flex gap-2">
						<Button onClick={handleSave} className="flex-1">
							<Save className="h-4 w-4 mr-2" />
							Spara
						</Button>
						{hasLocalKey && (
							<Button variant="outline" onClick={handleClear}>
								<Trash2 className="h-4 w-4 mr-2" />
								Rensa
							</Button>
						)}
					</div>

					{/* Additional Info */}
					<div className="text-xs text-muted-foreground space-y-1">
						<p>• Din API-nyckel sparas endast lokalt i din webbläsare</p>
						<p>• Nyckeln delas aldrig med servrar eller andra användare</p>
						<p>• Gemini 1.5 Flash är gratis upp till 15 förfrågningar per minut</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default SettingsModal;

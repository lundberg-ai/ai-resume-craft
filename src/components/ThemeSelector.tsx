
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onThemeChange,
  selectedColor,
  onColorChange,
}) => {
  const themes = [
    {
      id: "classic",
      name: "Classic",
      description: "Traditional resume format, clean and professional",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Contemporary design with colored header section",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple and elegant design with subtle accents",
    },
    {
      id: "creative",
      name: "Creative",
      description: "Bold design with gradient header for creative roles",
    },
    {
      id: "professional",
      name: "Professional",
      description: "Executive style with understated elegance",
    },
  ];
  
  const colors = [
    { id: "#9b87f5", name: "Purple" },
    { id: "#4C9AFF", name: "Blue" },
    { id: "#36B37E", name: "Green" },
    { id: "#FF5630", name: "Red" },
    { id: "#FFAB00", name: "Yellow" },
    { id: "#6554C0", name: "Violet" },
    { id: "#172B4D", name: "Navy" },
    { id: "#505F79", name: "Gray" },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Choose Theme</h3>
          <RadioGroup 
            value={selectedTheme} 
            onValueChange={onThemeChange}
            className="flex flex-col space-y-2"
          >
            {themes.map((theme) => (
              <div key={theme.id} className="flex items-center space-x-2">
                <RadioGroupItem value={theme.id} id={`theme-${theme.id}`} />
                <Label htmlFor={`theme-${theme.id}`} className="flex flex-col">
                  <span className="font-medium">{theme.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {theme.description}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Choose Color</h3>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <div 
                key={color.id}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() => onColorChange(color.id)}
                  className={`w-full aspect-square rounded-md transition-all ${
                    selectedColor === color.id 
                      ? 'ring-2 ring-primary ring-offset-2' 
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.id }}
                  title={color.name}
                  aria-label={`Select ${color.name} color theme`}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSelector;

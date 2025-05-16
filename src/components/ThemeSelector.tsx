
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
      name: "Klassisk",
      description: "Traditionellt CV-format, rent och professionellt",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Samtida design med färgad rubriksektion",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Enkel och elegant design med subtila accenter",
    },
    {
      id: "creative",
      name: "Kreativ",
      description: "Djärv design med gradientrubriker för kreativa roller",
    },
    {
      id: "professional",
      name: "Professionell",
      description: "Exekutiv stil med nedtonad elegans",
    },
  ];
  
  const colors = [
    { id: "#88CCFF", name: "Isblå" },
    { id: "#36B37E", name: "Smaragd" },
    { id: "#FF5630", name: "Koppar" },
    { id: "#FFAB00", name: "Amber" },
    { id: "#9b87f5", name: "Lavendel" },
    { id: "#FFD700", name: "Guld" },
    { id: "#172B4D", name: "Marinblå" },
    { id: "#505F79", name: "Grå" },
  ];

  return (
    <Card className="nordic-glass border-white/10">
      <CardContent className="pt-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 text-ice-blue">Välj tema</h3>
          <RadioGroup 
            value={selectedTheme} 
            onValueChange={onThemeChange}
            className="flex flex-col space-y-2"
          >
            {themes.map((theme) => (
              <div key={theme.id} className="flex items-center space-x-2">
                <RadioGroupItem value={theme.id} id={`theme-${theme.id}`} className="border-white/20 text-ice-blue data-[state=checked]:border-ice-blue data-[state=checked]:bg-ice-blue" />
                <Label htmlFor={`theme-${theme.id}`} className="flex flex-col">
                  <span className="font-medium text-white">{theme.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {theme.description}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <Separator className="my-4 bg-white/10" />
        
        <div>
          <h3 className="text-lg font-medium mb-4 text-ice-blue">Välj färg</h3>
          <div className="grid grid-cols-4 gap-3">
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
                      ? 'ring-2 ring-ice-blue shadow-[0_0_10px_rgba(136,204,255,0.5)] scale-110' 
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.id }}
                  title={color.name}
                  aria-label={`Välj färgtemat ${color.name}`}
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

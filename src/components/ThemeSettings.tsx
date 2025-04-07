
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeSettings() {
  const { theme, accentColor, toggleTheme, setAccentColor } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    { name: "purple", label: "Purple", color: "#8B5CF6" },
    { name: "blue", label: "Blue", color: "#0EA5E9" },
    { name: "green", label: "Green", color: "#10B981" },
    { name: "orange", label: "Orange", color: "#F97316" },
    { name: "pink", label: "Pink", color: "#EC4899" }
  ];

  return (
    <Card className={`transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-16"} overflow-hidden`}>
      <CardHeader className="p-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Appearance Settings</span>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Toggle settings</span>
            {isOpen ? "−" : "+"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          <div>
            <Label className="text-base mb-2 block">Theme</Label>
            <div className="flex items-center gap-4">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={toggleTheme}
              >
                <SunIcon className="h-4 w-4" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={toggleTheme}
              >
                <MoonIcon className="h-4 w-4" />
                Dark
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-base mb-2 block">Accent Color</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  className={`w-8 h-8 rounded-full transition-all ${
                    accentColor === color.name 
                      ? "ring-2 ring-offset-2 ring-black dark:ring-white" 
                      : ""
                  }`}
                  style={{ backgroundColor: color.color }}
                  onClick={() => setAccentColor(color.name as any)}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

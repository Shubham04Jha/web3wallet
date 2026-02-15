import { createContext, useContext, useEffect, useState } from "react";

type Theme = 'modern' | 'classic';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem('theme') as Theme;
        return stored || 'modern';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        // Remove old theme
        root.classList.remove('modern', 'classic');
        // Add new theme class (optional) and data attribute
        root.classList.add(theme);
        root.setAttribute('data-theme', theme);

        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'modern' ? 'classic' : 'modern');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme] = useState<Theme>('light');

    useEffect(() => {
        // Enforce light mode class removal and persistence
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove('dark');
    }, []);

    const toggleTheme = () => {
        // Disabled for unified branding
        console.log('Theme toggling is disabled for this brand identity.');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

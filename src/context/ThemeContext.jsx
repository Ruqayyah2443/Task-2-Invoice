import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export default function ThemeProvider ({children}) {
    const [theme, setTheme] = useState(
        () => localStorage.getItem('invoice.theme') || 'light'
    )

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        localStorage.setItem('invoice.theme', theme)
    }, [theme])

    function toggleTheme() {
        setTheme(
            prev => prev === "light" ? "dark" : "light"
        )
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )

}
export function useTheme(){
    return useContext(ThemeContext)
}
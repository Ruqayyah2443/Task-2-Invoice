import { useTheme } from "../../context/ThemeContext";
import Moon from '../../assets/Moon.svg?react'
import Sun from '../../assets/Sun.svg?react'
import AsideAvatar from '../../assets/AsideAvatar.svg?react'
import AsideTabletIcon from '../../assets/AsideTabletIcon.svg?react'

export default function Navbar() {
     const { theme, toggleTheme } = useTheme()
    return(
        <nav className="w-full h-18 bg-[var(--color-bg-sidebar)] 
        flex items-center justify-between">
            <div>
                <AsideTabletIcon />
            </div>
            <div className="flex items-center h-full">
               <button
                onClick={toggleTheme}
                aria-label="dark mode"
                className="px-6 text-[#7E88C3] 
                hover:text-white transition-colors
                 duration-200"
                >
                    {theme === 'light' ? <Moon /> : <Sun
                    />}
                </button>
                 {/* Vertical divider */}
                <div className="h-full w-px bg-[#494E6E]"
                />

                <div 
                className="w-8 h-8 rounded-full border-2
                border-transparent 
                hover:border-[var(--color-purple)]
                transition-colors duration-200 
                overflow-hidden cursor-pointer"
                >
                    <AsideAvatar/>
                </div>
            </div>
        </nav>
    )
}
import { useTheme } from "../../context/ThemeContext";
import Moon from '../../assets/Moon.svg?react'
import Sun from '../../assets/Sun.svg?react'
import AsideIcon from '../../assets/AsideIcon.svg?react'
import AsideAvatar from '../../assets/AsideAvatar.svg?react'
export default function Sidebar() {
    const { theme, toggleTheme } = useTheme()
    return(
        <aside className="fixed flex flex-col top-0 h-screen w-[103px] 
        items-center justify-between bg-[var(--color-bg-sidebar)]"
        style={{borderRadius: '0 20px 20px 0',}}>
            <div className="top-0 position-absolute">
                <AsideIcon/>

            </div>

            <div className="flex flex-col items-center w-full pb-6 gap-6">
                <button
                onClick={toggleTheme}
                aria-label="dark mode"
                className="text-[#7E88C3] hover:text-white 
                transition-colors duration-200"
                >
                    {theme === 'light' ? <Moon /> : <Sun />}
                </button>

                {/* divider */}
                <div  className="w-full h-px 
                bg-[#494E6E]">
                </div>

                <div
                className="w-8 h-8 rounded-full border-2
                border-transparent 
                hover:border-[var(--color-purple)]
                transition-colors duration-200 
                overflow-hidden cursor-pointer"
                >
                    <AsideAvatar />
                </div>

            </div>

        </aside>
    )
    
}
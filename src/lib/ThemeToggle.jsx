// ThemeToggle.jsx
import { Moon } from 'lucide-react'
import { Lightbulb } from 'lucide-react'
import { useEffect, useState } from 'react'

const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

    useEffect(() => {
        const root = window.document.documentElement
        if (theme === 'dark') {
            root.classList.add('dark')
            document.body.classList.add("dark_theme");
        } else {
            root.classList.remove('dark')
            document.body.classList.remove("dark_theme");
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <>
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full border text-gray-700"
            >
                {theme === 'dark' ? <Lightbulb /> : <Moon />}
            </button>
        </>
    )
}

export default ThemeToggle;
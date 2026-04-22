"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full bg-muted/50 animate-pulse" />
  }

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const getIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4 text-amber-500" />
    if (theme === 'dark') return <Moon className="w-4 h-4 text-indigo-400" />
    return <Monitor className="w-4 h-4 text-muted-foreground" />
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-9 h-9 rounded-full bg-background/50 border border-border/50 shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label="Toggle theme"
      title={`Current theme: ${theme}`}
    >
      <motion.div
        key={theme}
        initial={{ y: -20, opacity: 0, rotate: -90 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: 20, opacity: 0, rotate: 90 }}
        transition={{ duration: 0.2 }}
      >
        {getIcon()}
      </motion.div>
    </motion.button>
  )
}

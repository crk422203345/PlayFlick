import { ref, computed } from 'vue'

export type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('playflick_theme', newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('playflick_theme') as Theme | null
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
    } else {
      setTheme('light') // Default theme is light
    }
  }

  return {
    theme,
    isDark,
    initTheme,
    setTheme,
    toggleTheme,
  }
}

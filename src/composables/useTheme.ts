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

  const toggleTheme = (event?: MouseEvent) => {
    const nextTheme = theme.value === 'light' ? 'dark' : 'light'

    // Check if View Transitions API is supported and user hasn't requested reduced motion
    const isAppearanceTransition =
      'startViewTransition' in document &&
      event &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isAppearanceTransition) {
      setTheme(nextTheme)
      return
    }

    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme)
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]
      document.documentElement.animate(
        {
          clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 450,
          easing: 'ease-in-out',
          pseudoElement: isDark.value
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        },
      )
    })
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

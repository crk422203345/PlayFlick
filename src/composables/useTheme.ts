import { ref, computed } from 'vue'

export type Theme = 'light' | 'dark'

const initialTheme = document.documentElement.getAttribute('data-theme')
const theme = ref<Theme>(initialTheme === 'dark' ? 'dark' : 'light')

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')

  const applyTheme = (newTheme: Theme, persist: boolean) => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)

    if (persist) {
      try {
        localStorage.setItem('playflick_theme', newTheme)
      } catch {
        // Theme still works when storage is blocked.
      }
    }

    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null
    if (link) {
      link.href = newTheme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg'
    }

    const themeColor = document.querySelector('meta[name="theme-color"]')
    themeColor?.setAttribute('content', newTheme === 'dark' ? '#090a1a' : '#f5f5f7')
  }

  const setTheme = (newTheme: Theme) => applyTheme(newTheme, true)

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

    transition.ready
      .then(() => {
        const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
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
      .catch(() => {
        // The theme was already applied; only the decorative transition failed.
      })
  }

  const initTheme = () => {
    let savedTheme: Theme | null = null
    try {
      savedTheme = localStorage.getItem('playflick_theme') as Theme | null
    } catch {
      savedTheme = null
    }

    if (savedTheme === 'light' || savedTheme === 'dark') {
      applyTheme(savedTheme, false)
    } else {
      applyTheme(
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
        false,
      )
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

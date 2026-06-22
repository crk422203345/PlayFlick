<template>
  <footer class="relative z-10 border-t border-brand-border bg-brand-footer transition-colors duration-300">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <!-- Brand -->
        <div class="flex items-center gap-2.5">
          <span class="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#ff3366] to-[#c4224e]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="h-3.5 w-3.5 translate-x-px">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </span>
          <span class="text-sm font-semibold text-brand-text">PlayFlick</span>
          <span class="hidden text-brand-border-strong sm:inline">·</span>
          <p class="hidden text-xs text-brand-text-secondary sm:block">© 2026 PlayFlick Entertainment. All Rights Reserved.</p>
        </div>

        <!-- Links -->
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href="#" class="text-xs text-brand-text-secondary transition-colors duration-200 hover:text-brand-text">用户协议</a>
          <a href="#" class="text-xs text-brand-text-secondary transition-colors duration-200 hover:text-brand-text">隐私政策</a>
          <a href="#" class="text-xs text-brand-text-secondary transition-colors duration-200 hover:text-brand-text">内容规范</a>
          <a href="#" class="text-xs text-brand-text-secondary transition-colors duration-200 hover:text-brand-text">法律声明</a>
        </div>
      </div>
      <p class="mt-4 text-xs text-brand-text-secondary sm:hidden">© 2026 PlayFlick Entertainment. All Rights Reserved.</p>
    </div>
  </footer>
</template>

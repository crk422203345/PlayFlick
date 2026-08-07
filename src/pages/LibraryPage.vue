<script setup lang="ts">
import { computed, ref } from 'vue'
import { Bookmark, Clock3, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import EmptyState from '@/components/EmptyState.vue'
import SmartImage from '@/components/SmartImage.vue'
import { useLibrary, type LibraryKind, type LibraryRecord } from '@/composables/useLibrary'

type LibraryTab = 'favorites' | 'history'
type LibraryScope = 'all' | LibraryKind

const router = useRouter()
const library = useLibrary()
const activeTab = ref<LibraryTab>('favorites')
const activeScope = ref<LibraryScope>('all')

const records = computed(() =>
  (activeTab.value === 'favorites' ? library.favorites.value : library.history.value).filter(
    (item) => activeScope.value === 'all' || item.kind === activeScope.value,
  ),
)

const openEntry = (entry: LibraryRecord) => {
  router.push({
    name: entry.kind === 'drama' ? 'drama-detail' : 'game-detail',
    params: { id: entry.key },
  })
}

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' }).format(timestamp)
</script>

<template>
  <section class="border-b border-brand-border bg-brand-card/35">
    <div class="mx-auto max-w-7xl px-4 py-11 sm:px-6 lg:px-8">
      <div class="flex items-start gap-4">
        <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#7c4dff]/12">
          <Bookmark class="h-6 w-6 text-[#8b66ff]" />
        </span>
        <div>
          <h1 class="text-3xl font-black text-brand-text sm:text-4xl">我的片单</h1>
          <p class="mt-3 text-base leading-7 text-brand-text-secondary">
            收藏喜欢的内容，随时回到最近看过的短剧和小游戏。
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="mx-auto min-h-[600px] max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
    <div
      class="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border pb-5"
    >
      <div class="flex gap-2">
        <button
          type="button"
          class="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold"
          :class="
            activeTab === 'favorites' ? 'bg-brand-text text-brand-bg' : 'text-brand-text-secondary'
          "
          @click="activeTab = 'favorites'"
        >
          <Bookmark class="h-4 w-4" /> 收藏 {{ library.favorites.value.length }}
        </button>
        <button
          type="button"
          class="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold"
          :class="
            activeTab === 'history' ? 'bg-brand-text text-brand-bg' : 'text-brand-text-secondary'
          "
          @click="activeTab = 'history'"
        >
          <Clock3 class="h-4 w-4" /> 最近浏览
        </button>
      </div>

      <button
        v-if="activeTab === 'history' && library.history.value.length > 0"
        type="button"
        class="flex items-center gap-2 text-sm font-bold text-brand-text-secondary transition hover:text-[#ff4d7e]"
        title="清空浏览历史"
        @click="library.clearHistory()"
      >
        <Trash2 class="h-4 w-4" /> 清空历史
      </button>
    </div>

    <div class="my-6 flex flex-wrap gap-2">
      <button
        v-for="scope in [
          { value: 'all', label: '全部' },
          { value: 'drama', label: '短剧' },
          { value: 'game', label: '小游戏' },
        ] as const"
        :key="scope.value"
        type="button"
        class="rounded-full border px-4 py-2 text-sm font-bold"
        :class="
          activeScope === scope.value
            ? 'border-brand-text bg-brand-text text-brand-bg'
            : 'border-brand-border text-brand-text-secondary'
        "
        @click="activeScope = scope.value"
      >
        {{ scope.label }}
      </button>
    </div>

    <div v-if="records.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="entry in records"
        :key="`${entry.kind}-${entry.key}`"
        class="group grid grid-cols-[112px_1fr] overflow-hidden rounded-lg border border-brand-border bg-brand-card shadow-md shadow-brand-shadow"
      >
        <button type="button" class="relative min-h-36 overflow-hidden" @click="openEntry(entry)">
          <SmartImage
            :src="entry.image"
            :alt="entry.title"
            :fallback-kind="entry.kind"
            class="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </button>
        <div class="flex min-w-0 flex-col p-4">
          <span class="text-xs font-bold text-brand-text-secondary">
            {{ entry.kind === 'drama' ? '短剧' : '小游戏' }} · {{ entry.category }}
          </span>
          <button
            type="button"
            class="mt-2 line-clamp-2 text-left text-base font-black text-brand-text transition hover:text-brand-primary"
            @click="openEntry(entry)"
          >
            {{ entry.title }}
          </button>
          <p class="mt-2 text-xs text-brand-text-secondary">{{ entry.metric }}</p>
          <div class="mt-auto flex items-center justify-between gap-2 pt-4">
            <span class="text-xs text-brand-text-tertiary">{{ formatDate(entry.updatedAt) }}</span>
            <button
              v-if="activeTab === 'favorites'"
              type="button"
              class="grid h-8 w-8 place-items-center text-brand-text-secondary transition hover:text-[#ff4d7e]"
              :aria-label="`取消收藏：${entry.title}`"
              title="取消收藏"
              @click="library.removeFavorite(entry)"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>
    </div>

    <EmptyState
      v-else
      :title="activeTab === 'favorites' ? '片单还是空的' : '还没有浏览记录'"
      :description="
        activeTab === 'favorites'
          ? '在内容详情页加入喜欢的短剧或游戏'
          : '打开任意内容详情后会自动记录'
      "
      tone="purple"
    />
  </section>
</template>

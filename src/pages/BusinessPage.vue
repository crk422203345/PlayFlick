<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Building2, CheckCircle2, Send } from 'lucide-vue-next'
import { aboutApi } from '@/api/modules'
import { getErrorMessage } from '@/utils/content'

const form = reactive({
  type: '内容合作',
  name: '',
  contact: '',
  organization: '',
  message: '',
})
const submitting = ref(false)
const success = ref(false)
const errorMessage = ref('')

const submit = async () => {
  submitting.value = true
  errorMessage.value = ''
  success.value = false

  try {
    await aboutApi.submitBusinessInquiry({ ...form })
    success.value = true
    Object.assign(form, { name: '', contact: '', organization: '', message: '' })
  } catch (error) {
    errorMessage.value = getErrorMessage(error, '暂时无法提交，请稍后重试')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="border-b border-brand-border bg-brand-card/35">
    <div class="mx-auto max-w-5xl px-4 py-11 sm:px-6 lg:px-8">
      <div class="flex items-start gap-4">
        <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#00bfa5]/12">
          <Building2 class="h-6 w-6 text-[#00a892]" />
        </span>
        <div>
          <h1 class="text-3xl font-black text-brand-text sm:text-4xl">商务合作</h1>
          <p class="mt-3 max-w-2xl text-base leading-7 text-brand-text-secondary">
            面向内容版权、游戏发行、品牌活动与渠道合作开放沟通。
          </p>
        </div>
      </div>
    </div>
  </section>

  <section
    class="mx-auto grid max-w-5xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8"
  >
    <div>
      <h2 class="text-xl font-black text-brand-text">合作方向</h2>
      <div class="mt-5 space-y-4 text-sm leading-7 text-brand-text-secondary">
        <p><strong class="text-brand-text">内容合作</strong><br />短剧版权、联合出品与内容分发。</p>
        <p><strong class="text-brand-text">游戏合作</strong><br />小游戏接入、联运与活动发行。</p>
        <p><strong class="text-brand-text">品牌合作</strong><br />专题活动、内容植入与联合营销。</p>
      </div>
    </div>

    <form class="grid gap-5" @submit.prevent="submit">
      <label class="grid gap-2 text-sm font-bold text-brand-text">
        合作类型
        <select
          v-model="form.type"
          class="min-h-11 rounded-md border border-brand-border bg-brand-card px-3 text-brand-text outline-none focus:border-brand-border-strong"
        >
          <option>内容合作</option>
          <option>游戏合作</option>
          <option>品牌合作</option>
          <option>渠道合作</option>
        </select>
      </label>
      <div class="grid gap-5 sm:grid-cols-2">
        <label class="grid gap-2 text-sm font-bold text-brand-text">
          联系人
          <input
            v-model.trim="form.name"
            required
            class="min-h-11 rounded-md border border-brand-border bg-brand-card px-3 text-brand-text outline-none focus:border-brand-border-strong"
          />
        </label>
        <label class="grid gap-2 text-sm font-bold text-brand-text">
          联系方式
          <input
            v-model.trim="form.contact"
            required
            placeholder="手机、微信或邮箱"
            class="min-h-11 rounded-md border border-brand-border bg-brand-card px-3 text-brand-text outline-none focus:border-brand-border-strong"
          />
        </label>
      </div>
      <label class="grid gap-2 text-sm font-bold text-brand-text">
        公司或团队
        <input
          v-model.trim="form.organization"
          class="min-h-11 rounded-md border border-brand-border bg-brand-card px-3 text-brand-text outline-none focus:border-brand-border-strong"
        />
      </label>
      <label class="grid gap-2 text-sm font-bold text-brand-text">
        合作说明
        <textarea
          v-model.trim="form.message"
          required
          rows="6"
          class="resize-y rounded-md border border-brand-border bg-brand-card p-3 text-brand-text outline-none focus:border-brand-border-strong"
        ></textarea>
      </label>

      <p v-if="success" class="flex items-center gap-2 text-sm font-bold text-[#00a892]">
        <CheckCircle2 class="h-4 w-4" /> 合作意向已提交，我们会尽快联系你。
      </p>
      <p v-else-if="errorMessage" class="text-sm font-bold text-[#ff4d7e]">{{ errorMessage }}</p>

      <button
        type="submit"
        class="flex min-h-11 w-fit items-center gap-2 rounded-full bg-brand-text px-6 text-sm font-black text-brand-bg disabled:opacity-60"
        :disabled="submitting"
      >
        <Send class="h-4 w-4" /> {{ submitting ? '提交中...' : '提交合作意向' }}
      </button>
    </form>
  </section>
</template>

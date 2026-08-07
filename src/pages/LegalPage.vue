<script setup lang="ts">
import { computed } from 'vue'
import { FileText } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

interface LegalSection {
  title: string
  paragraphs: string[]
}

interface LegalDocument {
  title: string
  summary: string
  sections: LegalSection[]
}

const route = useRoute()
const router = useRouter()

const documents: Record<string, LegalDocument> = {
  terms: {
    title: '用户协议',
    summary: '本协议说明用户访问和使用 PlayFlick 服务时的基本权利与责任。',
    sections: [
      {
        title: '服务说明',
        paragraphs: [
          'PlayFlick 提供短剧与小游戏的信息展示、内容发现和第三方平台跳转服务。部分内容由合作平台提供，实际播放、游戏和交易服务以对应平台规则为准。',
        ],
      },
      {
        title: '使用规则',
        paragraphs: [
          '用户不得利用本平台从事违法活动、干扰服务运行、批量抓取内容或侵犯他人合法权益。用户应妥善管理自己的设备与账号信息。',
        ],
      },
      {
        title: '服务变更',
        paragraphs: [
          '平台可能根据产品运营、法律要求或合作内容变化调整功能。重大调整将通过页面提示或其他合理方式进行说明。',
        ],
      },
    ],
  },
  privacy: {
    title: '隐私政策',
    summary: '我们坚持最少必要原则处理产品运行所需的信息。',
    sections: [
      {
        title: '本地数据',
        paragraphs: [
          '主题偏好、收藏内容和浏览历史默认保存在用户当前浏览器中，用于恢复使用状态。清除浏览器数据后，这些本地记录可能无法恢复。',
        ],
      },
      {
        title: '网络请求',
        paragraphs: [
          '平台访问内容接口时可能传递必要的设备网络信息。跳转至第三方平台后，其数据处理行为由对应平台的隐私政策约束。',
        ],
      },
      {
        title: '信息安全',
        paragraphs: ['我们采用合理的技术与管理措施保护数据，并持续减少不必要的收集、存储和共享。'],
      },
    ],
  },
  content: {
    title: '内容规范',
    summary: 'PlayFlick 致力于提供健康、清晰且尊重创作者权益的内容环境。',
    sections: [
      {
        title: '禁止内容',
        paragraphs: [
          '平台不接受违法违规、恶意欺诈、仇恨攻击、侵犯未成年人权益以及侵犯版权或其他合法权益的内容。',
        ],
      },
      {
        title: '版权与授权',
        paragraphs: [
          '内容提供方应确保拥有必要的传播和使用授权。权利人发现疑似侵权内容时，可通过商务合作页面提交权利证明和处理请求。',
        ],
      },
      {
        title: '内容处理',
        paragraphs: [
          '对于违反规范的内容，平台可根据风险程度采取限制展示、移除链接或终止合作等措施。',
        ],
      },
    ],
  },
  legal: {
    title: '法律声明',
    summary: '本页面说明平台内容来源、知识产权与责任边界。',
    sections: [
      {
        title: '知识产权',
        paragraphs: [
          'PlayFlick 的品牌标识、界面设计和自有文字内容受相关法律保护。第三方内容的权利归原权利人所有。',
        ],
      },
      {
        title: '第三方服务',
        paragraphs: [
          '平台中的外部链接用于连接合作或公开服务。第三方服务的可用性、内容和交易结果由对应服务提供方负责。',
        ],
      },
      {
        title: '声明更新',
        paragraphs: ['本声明可能根据法律法规和业务实际进行更新，更新版本自页面发布之日起生效。'],
      },
    ],
  },
}

const document = computed(() => documents[String(route.params.document)] ?? documents.legal!)
</script>

<template>
  <section class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="border-b border-brand-border pb-8">
      <span class="grid h-12 w-12 place-items-center rounded-xl bg-brand-card">
        <FileText class="h-6 w-6 text-brand-text-secondary" />
      </span>
      <h1 class="mt-5 text-3xl font-black text-brand-text sm:text-4xl">{{ document.title }}</h1>
      <p class="mt-3 text-base leading-7 text-brand-text-secondary">{{ document.summary }}</p>
      <p class="mt-4 text-xs text-brand-text-tertiary">更新日期：2026 年 8 月 7 日</p>
    </div>

    <article class="py-8">
      <section v-for="section in document.sections" :key="section.title" class="mb-9">
        <h2 class="text-xl font-black text-brand-text">{{ section.title }}</h2>
        <p
          v-for="paragraph in section.paragraphs"
          :key="paragraph"
          class="mt-3 text-base leading-8 text-brand-text-secondary"
        >
          {{ paragraph }}
        </p>
      </section>
    </article>

    <button
      type="button"
      class="rounded-full border border-brand-border bg-brand-card px-5 py-2.5 text-sm font-bold text-brand-text-secondary"
      @click="router.back()"
    >
      返回上一页
    </button>
  </section>
</template>

<script setup>
// 作品地图页（F-map）：三主线 + 独立作品 —— 站内第一个由 kb-ui-vue 驱动的页面
// 数据：静态分组（体系关系是编辑性内容，非生成内容）；站内 slug 复用 repo-map.json
import { computed } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import { KbCard, KbTag, KbDivider } from 'kb-ui-vue'
import 'kb-ui-vue/styles/tokens.css'
import 'kb-ui-vue/styles/Card.css'
import 'kb-ui-vue/styles/Tag.css'
import 'kb-ui-vue/styles/Divider.css'
import { repoMap } from '@/utils/content.js'

const clusters = [
  {
    id: 'agent',
    title: 'AI Agent 生态',
    desc: '一个常驻 Runtime 为核，MCP 工具与密钥设施围绕成生态',
    items: [
      { repo: 'lumen', role: 'Runtime 核心', type: 'primary', desc: '24/7 常驻个人 Agent Runtime（Go）：内置 MCP 注册（stdio/SSE/HTTP）与 L0~L3 分级权限' },
      { repo: 'voiceconsole', role: 'MCP 插件 · 语音入口', type: 'success', desc: '语音指令控制台 MCP：STT + 意图 + 安全门 + TTS，可注册进 lumen' },
      { repo: 'dsh-logtimeline', role: 'MCP 插件 · 日志查询', type: 'success', desc: '中文自然语言时间表达式查询本地日志，可注册进 lumen' },
      { repo: 'keyvault', role: '密钥设施', type: 'warning', desc: '本地加密钥匙串，专管 LLM Key / GitHub Token，生态各工具的公共前置' },
      { repo: 'chatez', role: '平级工作台', type: 'info', desc: '可配置 Prompt + Skill 的 AI 工作台（纯 Web）' },
    ],
  },
  {
    id: 'infra',
    title: 'UI / 工程基建',
    desc: '自建组件库与设计资产——本站与生态项目是它们的真实消费方',
    items: [
      { repo: 'kb-ui', role: '组件库 · npm 四包', type: 'primary', desc: '73 组件 · 46 主题 · 脚手架；本页即由 kb-ui-vue 驱动（dogfooding）' },
      { repo: 'design-assets', role: '设计资产', type: 'default', desc: 'AI 生成设计资产库，24 风格元数据 + 使用策略（CC0）' },
    ],
  },
  {
    id: 'train',
    title: '训练 / 评测平台',
    desc: '离线训练与在线判题互为出口：题解变抄写题，训练通向真实评测',
    items: [
      { repo: 'codedrill', role: '离线训练 · 635 题', type: 'primary', desc: '题库训练 + SRS 遗忘曲线（Electron / Web / Android）' },
      { repo: 'polycodehub', role: '在线判题 · 四层沙箱', type: 'danger', desc: '全栈 OJ：seccomp 白名单 / cgroup v2 / namespaces / tmpfs jail' },
    ],
  },
]

const independents = [
  { repo: 'evocode', desc: 'AI 软件体检与演化平台' },
  { repo: 'desktoppet', desc: 'Electron 桌面宠物' },
  { repo: 'picren', desc: '图片批量 AI 重命名/整理器' },
  { repo: 'developer-intelligence', desc: 'AI 深度理解代码仓库' },
  { repo: 'eclipse-wasteland', desc: '浏览器端 Three.js PVE 射击游戏' },
  { repo: 'spotlight-wallpaper', desc: 'Windows 聚光灯动态壁纸' },
  { repo: 'huayinlaoqiang', desc: '华阴老腔 · 非遗展示站' },
]

const total = computed(() =>
  clusters.reduce((n, c) => n + c.items.length, 0) + independents.length
)

function linkOf(repo) {
  const entry = repoMap?.[repo]
  return entry?.slug ? `/projects/${entry.slug}` : null
}
function githubOf(repo) {
  return `https://github.com/anyuer678/${repo}`
}
</script>

<template>
  <div class="container">
    <PageHeader
      title="作品地图"
      description="仓库不是孤岛：三主线 + 一个回流口"
      :count="total"
    />

    <section
      v-for="cluster in clusters"
      :key="cluster.id"
      class="map-cluster"
    >
      <SectionTitle :title="cluster.title" :description="cluster.desc" />
      <KbCard shadow="hover" class="map-card">
        <ul class="map-list">
          <li v-for="item in cluster.items" :key="item.repo" class="map-item">
            <div class="map-item__head">
              <router-link
                v-if="linkOf(item.repo)"
                :to="linkOf(item.repo)"
                class="map-item__name"
              >{{ item.repo }}</router-link>
              <a
                v-else
                :href="githubOf(item.repo)"
                target="_blank"
                rel="noopener"
                class="map-item__name"
              >{{ item.repo }}</a>
              <KbTag :type="item.type" size="small">{{ item.role }}</KbTag>
            </div>
            <p class="map-item__desc">{{ item.desc }}</p>
          </li>
        </ul>
      </KbCard>
    </section>

    <section class="map-cluster">
      <SectionTitle title="独立作品" description="与主线无耦合的项目，诚实单列而不硬凑体系" />
      <KbCard shadow="hover" class="map-card">
        <ul class="map-list map-list--inline">
          <li v-for="item in independents" :key="item.repo" class="map-item map-item--inline">
            <router-link
              v-if="linkOf(item.repo)"
              :to="linkOf(item.repo)"
              class="map-item__name"
            >{{ item.repo }}</router-link>
            <a
              v-else
              :href="githubOf(item.repo)"
              target="_blank"
              rel="noopener"
              class="map-item__name"
            >{{ item.repo }}</a>
            <span class="map-item__desc map-item__desc--inline">{{ item.desc }}</span>
          </li>
        </ul>
      </KbCard>
    </section>

    <KbDivider />
    <p class="map-footnote">
      生态关系均可在各仓 README「生态」区块与代码中验证（lumen 的 MCP 注册、kb-ui 的 npm 包、题解转换工作流）；
      全部仓库的入口见 <a href="https://github.com/anyuer678" target="_blank" rel="noopener">GitHub Profile</a>。
    </p>
  </div>
</template>

<style scoped>
.map-cluster {
  margin-block-end: var(--space-6, 2.5rem);
}
.map-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.9rem;
}
.map-item__head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.map-item__name {
  font-weight: 600;
  font-size: 1.02rem;
}
.map-item__desc {
  margin: 0.25rem 0 0;
  font-size: 0.92rem;
  opacity: 0.85;
}
.map-list--inline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
}
.map-item--inline {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}
.map-item__desc--inline {
  margin: 0;
  font-size: 0.85rem;
}
.map-footnote {
  font-size: 0.85rem;
  opacity: 0.75;
}
</style>

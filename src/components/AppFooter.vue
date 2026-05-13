<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h4>关于我们</h4>
          <p>敏感词智能检测工具，帮助您快速检测和规避敏感词，避免内容违规。</p>
        </div>
        <div class="footer-section">
          <h4>快速链接</h4>
          <ul>
            <li><router-link to="/">检测工具</router-link></li>
            <li><router-link to="/word-lib">词库管理</router-link></li>
            <li><router-link to="/stats">统计分析</router-link></li>
            <li><router-link to="/about">关于我们</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>词库统计</h4>
          <div class="stats">
            <div class="stat-item">
              <span class="stat-label">敏感词总数</span>
              <span class="stat-value">{{ totalCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">分类数量</span>
              <span class="stat-value">{{ categories.length }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2024 敏感词检测工具. All rights reserved.</p>
        <p v-if="lastUpdateTime">
          词库最后更新：{{ formatTime(lastUpdateTime) }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useWordLibStore } from '@/stores/wordLib'
import dayjs from 'dayjs'

const wordLibStore = useWordLibStore()

const totalCount = computed(() => wordLibStore.totalCount)
const categories = computed(() => wordLibStore.categories)
const lastUpdateTime = computed(() => wordLibStore.lastUpdateTime)

onMounted(() => {
  wordLibStore.syncWordLib()
})

function formatTime(time) {
  if (!time) return '-'
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}
</script>

<style scoped>
.app-footer {
  background: var(--color-bg-primary);
  border-top: 1px solid var(--border-color-light);
  padding: 40px 0 20px;
  margin-top: 60px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 16px;
}

.footer-section p {
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 8px;
}

.footer-section a {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-section a:hover {
  color: var(--color-primary);
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.stat-label {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.stat-value {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 16px;
}

.footer-bottom {
  padding-top: 20px;
  border-top: 1px solid var(--border-color-light);
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.footer-bottom p {
  margin: 4px 0;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
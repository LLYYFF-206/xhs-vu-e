<template>
  <div class="stats-container">
    <app-header />
    <main class="main-content">
      <el-container>
        <el-row :gutter="24" justify="center">
          <el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16">
            <el-card>
              <template #header>
                <div class="card-header">
                  <h2>统计信息</h2>
                  <el-button
                    :icon="Refresh"
                    @click="refreshStats"
                    :loading="loading"
                  >
                    刷新
                  </el-button>
                </div>
              </template>

              <!-- 概览统计 -->
              <div class="overview-stats">
                <div class="stat-card primary">
                  <div class="stat-icon">
                    <el-icon><Document /></el-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">敏感词总数</div>
                    <div class="stat-value">{{ stats.totalWords || 0 }}</div>
                  </div>
                </div>
                <div class="stat-card success">
                  <div class="stat-icon">
                    <el-icon><Folder /></el-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">分类数量</div>
                    <div class="stat-value">{{ stats.categoryCount || 0 }}</div>
                  </div>
                </div>
                <div class="stat-card info">
                  <div class="stat-icon">
                    <el-icon><Clock /></el-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">最后更新</div>
                    <div class="stat-value small">
                      {{ formatTime(stats.lastUpdateTime) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 分类统计 -->
              <div class="section-title">分类统计</div>
              <el-table
                :data="categoryStats"
                v-loading="loading"
                stripe
                style="width: 100%"
              >
                <el-table-column type="index" label="#" width="60" />
                <el-table-column prop="category" label="分类名称" />
                <el-table-column prop="count" label="敏感词数量" width="150" align="right">
                  <template #default="{ row }">
                    <span class="count-badge">{{ row.count }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="占比" width="120" align="right">
                  <template #default="{ row }">
                    {{ getPercentage(row.count) }}%
                  </template>
                </el-table-column>
                <el-table-column label="分布" min-width="200">
                  <template #default="{ row }">
                    <el-progress
                      :percentage="getPercentage(row.count)"
                      :color="getCategoryColor(row.category)"
                    />
                  </template>
                </el-table-column>
              </el-table>

              <!-- 分类列表 -->
              <div class="section-title mt-lg">所有分类</div>
              <div class="category-list">
                <el-tag
                  v-for="cat in allCategories"
                  :key="cat"
                  size="large"
                  class="category-tag"
                  @click="filterByCategory(cat)"
                >
                  {{ cat }}
                </el-tag>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-container>
    </main>
    <app-footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Refresh, Document, Folder, Clock } from '@element-plus/icons-vue'
import { useWordLibStore } from '@/stores/wordLib'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import dayjs from 'dayjs'

const router = useRouter()
const wordLibStore = useWordLibStore()

const stats = computed(() => wordLibStore.stats)
const loading = computed(() => wordLibStore.loading)

const categoryStats = computed(() => {
  if (!stats.value.countByCategory) return []
  return Object.entries(stats.value.countByCategory)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
})

const allCategories = computed(() => stats.value.categories || [])
const totalWords = computed(() => stats.value.totalWords || 0)

onMounted(() => {
  loadStats()
})

async function loadStats() {
  await wordLibStore.loadStats()
}

function refreshStats() {
  loadStats()
}

function getPercentage(count) {
  if (totalWords.value === 0) return 0
  return Math.round((count / totalWords.value) * 100)
}

function getCategoryColor(category) {
  const colors = [
    '#ff2442', '#52c41a', '#1890ff', '#faad14',
    '#f759ab', '#13c2c2', '#722ed1', '#fa541c'
  ]
  const index = allCategories.value.indexOf(category) % colors.length
  return colors[index]
}

function formatTime(time) {
  if (!time) return '-'
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

function filterByCategory(category) {
  router.push({
    path: '/word-lib',
    query: { category }
  })
}
</script>

<style scoped>
.stats-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: var(--spacing-xl) 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: var(--radius-lg);
  background: var(--color-bg-secondary);
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  margin-right: 16px;
  font-size: 24px;
}

.stat-card.primary .stat-icon {
  background: rgba(255, 36, 66, 0.1);
  color: var(--color-primary);
}

.stat-card.success .stat-icon {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.stat-card.info .stat-icon {
  background: rgba(24, 144, 255, 0.1);
  color: var(--color-info);
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.stat-value.small {
  font-size: 14px;
  font-weight: 500;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--border-color-light);
}

.count-badge {
  display: inline-block;
  min-width: 30px;
  padding: 2px 8px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.category-tag:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}
</style>
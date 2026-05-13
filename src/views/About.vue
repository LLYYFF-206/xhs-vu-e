<template>
  <div class="about-container">
    <app-header />
    <main class="main-content">
      <el-container>
        <el-row :gutter="24" justify="center">
          <el-col :xs="24" :sm="22" :md="20" :lg="16" :xl="12">
            <el-card>
              <template #header>
                <h2>关于我们</h2>
              </template>

              <div class="about-content">
                <div class="intro">
                  <h3>敏感词智能检测工具</h3>
                  <p>
                    本工具旨在帮助内容创作者、运营人员和营销团队实时检测文本中的敏感词，避免违规内容导致限流、封号等问题。
                  </p>
                </div>

                <el-divider />

                <div class="features">
                  <h3>功能特点</h3>
                  <ul>
                    <li>
                      <el-icon><Check /></el-icon>
                      <span>实时检测，毫秒级响应</span>
                    </li>
                    <li>
                      <el-icon><Check /></el-icon>
                      <span>多行业词库，覆盖全面</span>
                    </li>
                    <li>
                      <el-icon><Check /></el-icon>
                      <span>用户可贡献，词库持续更新</span>
                    </li>
                    <li>
                      <el-icon><Check /></el-icon>
                      <span>一键替换，快速修正</span>
                    </li>
                    <li>
                      <el-icon><Check /></el-icon>
                      <span>分类统计，数据可视化</span>
                    </li>
                  </ul>
                </div>

                <el-divider />

                <div class="contact">
                  <h3>联系我们</h3>
                  <p>如有任何问题或建议，欢迎通过以下方式联系：</p>
                  <el-space direction="vertical" :size="12">
                    <el-tag type="info" size="large">
                      <el-icon><Message /></el-icon>
                      邮箱：support@example.com
                    </el-tag>
                    <el-tag type="success" size="large">
                      <el-icon><ChatDotRound /></el-icon>
                      微信：敏感词检测助手
                    </el-tag>
                  </el-space>
                </div>

                <el-divider />

                <div class="version">
                  <h3>版本信息</h3>
                  <el-descriptions :column="1" border>
                    <el-descriptions-item label="当前版本">v1.0.0</el-descriptions-item>
                    <el-descriptions-item label="最后更新">{{ formatDate() }}</el-descriptions-item>
                    <el-descriptions-item label="技术栈">
                      <el-tag size="small">Vue 3</el-tag>
                      <el-tag size="small" class="ml-sm">Element Plus</el-tag>
                      <el-tag size="small" class="ml-sm">Pinia</el-tag>
                      <el-tag size="small" class="ml-sm">Spring Boot</el-tag>
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
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
import { Check, Message, ChatDotRound } from '@element-plus/icons-vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import dayjs from 'dayjs'

function formatDate() {
  return dayjs().format('YYYY-MM-DD')
}
</script>

<style scoped>
.about-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: var(--spacing-xl) 0;
}

.about-content h2,
.about-content h3 {
  color: var(--color-text-primary);
  margin-top: 0;
}

.about-content h2 {
  font-size: 20px;
}

.about-content h3 {
  font-size: 16px;
  margin-bottom: 16px;
}

.about-content p {
  color: var(--color-text-regular);
  line-height: 1.8;
  margin-bottom: 16px;
}

.features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features li {
  display: flex;
  align-items: center;
  padding: 8px 0;
  color: var(--color-text-regular);
}

.features li .el-icon {
  color: var(--color-success);
  margin-right: 8px;
  font-size: 18px;
}

.contact {
  margin-bottom: 24px;
}
</style>
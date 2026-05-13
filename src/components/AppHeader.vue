<template>
  <header class="app-header">
    <div class="container">
      <div class="header-left">
        <router-link to="/" class="logo">
          <el-icon class="logo-icon"><DocumentCopy /></el-icon>
          <span>敏感词检测</span>
        </router-link>
      </div>

      <nav class="header-nav">
        <router-link to="/" class="nav-link">
          <el-icon><Monitor /></el-icon>
          <span>检测</span>
        </router-link>
        <router-link to="/word-lib" class="nav-link">
          <el-icon><Collection /></el-icon>
          <span>词库</span>
        </router-link>
        <router-link to="/stats" class="nav-link">
          <el-icon><DataAnalysis /></el-icon>
          <span>统计</span>
        </router-link>
        <router-link to="/about" class="nav-link">
          <el-icon><InfoFilled /></el-icon>
          <span>关于</span>
        </router-link>
      </nav>

      <div class="header-right">
        <el-button
          :icon="Moon"
          circle
          @click="toggleTheme"
          v-if="!themeStore.isDark"
        />
        <el-button
          :icon="Sunny"
          circle
          @click="toggleTheme"
          v-else
        />

        <el-button
          :icon="isMobileNavOpen ? 'Close' : 'Menu'"
          circle
          class="mobile-nav-toggle"
          @click="toggleMobileNav"
        />
      </div>
    </div>

    <!-- 移动端导航 -->
    <el-drawer
      v-model="isMobileNavOpen"
      direction="rtl"
      size="70%"
      :with-header="false"
    >
      <div class="mobile-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="mobile-nav-link"
          @click="closeMobileNav"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.name }}</span>
        </router-link>
      </div>
    </el-drawer>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import {
  DocumentCopy,
  Monitor,
  Collection,
  DataAnalysis,
  InfoFilled,
  Moon,
  Sunny,
  Menu,
  Close
} from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const isMobileNavOpen = ref(false)

const navItems = [
  { path: '/', name: '检测', icon: Monitor },
  { path: '/word-lib', name: '词库', icon: Collection },
  { path: '/stats', name: '统计', icon: DataAnalysis },
  { path: '/about', name: '关于', icon: InfoFilled }
]

function toggleTheme() {
  themeStore.toggleTheme()
}

function toggleMobileNav() {
  isMobileNavOpen.value = !isMobileNavOpen.value
}

function closeMobileNav() {
  isMobileNavOpen.value = false
}
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-bg-primary);
  box-shadow: var(--shadow-sm);
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-decoration: none;
}

.logo-icon {
  font-size: 24px;
  color: var(--color-primary);
}

.header-nav {
  display: flex;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  color: var(--color-text-regular);
  text-decoration: none;
  transition: all 0.2s;
  font-size: 14px;
}

.nav-link:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.nav-link.router-link-active {
  background: rgba(255, 36, 66, 0.1);
  color: var(--color-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-nav-toggle {
  display: none;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: var(--radius-md);
  color: var(--color-text-regular);
  text-decoration: none;
  transition: all 0.2s;
}

.mobile-nav-link:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.mobile-nav-link.router-link-active {
  background: rgba(255, 36, 66, 0.1);
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .header-nav {
    display: none;
  }

  .header-right :deep(.el-button:not(.mobile-nav-toggle)) {
    display: none;
  }

  .mobile-nav-toggle {
    display: flex;
  }
}
</style>
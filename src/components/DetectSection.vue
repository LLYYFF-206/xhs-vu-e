<template>
  <div class="detect-section">
    <el-row :gutter="24">
      <!-- 左侧输入区 -->
      <el-col :xs="24" :md="12">
        <el-card class="input-card">
          <template #header>
            <div class="card-header">
              <span>输入检测文本</span>
              <el-tag type="info" size="small">
                {{ inputText.length }} 字符
              </el-tag>
            </div>
          </template>

          <el-input
            v-model="inputText"
            type="textarea"
            :rows="12"
            placeholder="请输入或粘贴要检测的文案内容..."
            @input="handleInput"
            class="text-input"
          />

          <div class="action-buttons">
            <el-button
              type="primary"
              :icon="Search"
              :loading="detecting"
              @click="handleDetect"
              size="large"
            >
              开始检测
            </el-button>
            <el-button
              :icon="Delete"
              @click="handleClear"
              size="large"
            >
              清空
            </el-button>
          </div>

          <el-divider />

          <!-- 快捷操作 -->
          <div class="quick-actions">
            <span class="quick-label">快捷操作：</span>
            <el-button link @click="loadSample">加载示例文本</el-button>
            <el-button link @click="pasteText">粘贴</el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧结果区 -->
      <el-col :xs="24" :md="12">
        <el-card class="result-card">
          <template #header>
            <div class="card-header">
              <span>检测结果</span>
              <el-tag
                :type="result?.isClean ? 'success' : 'danger'"
                size="small"
                v-if="result"
              >
                {{ result.isClean ? '无敏感词' : '发现敏感词' }}
              </el-tag>
            </div>
          </template>

          <div v-if="!result" class="empty-result">
<el-empty description='请输入文本后点击"开始检测"' />
          </div>

          <div v-else>
            <!-- 统计信息 -->
            <div class="result-stats">
              <div class="stat-item">
                <span class="stat-label">检测时长</span>
                <span class="stat-value">{{ result.detectionTimeMs }}ms</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">敏感词数量</span>
                <span class="stat-value" :class="{ danger: !result.isClean }">
                  {{ result.totalWords }}
                </span>
              </div>
            </div>

            <el-divider />

            <!-- 处理后文本 -->
            <div class="processed-text" v-if="!result.isClean">
              <div class="section-title">处理后文本</div>
              <div class="text-preview">{{ result.processedText }}</div>
              <el-button
                type="primary"
                link
                :icon="CopyDocument"
                @click="copyText(result.processedText)"
                size="small"
              >
                复制处理后的文本
              </el-button>
            </div>

            <div v-if="result.isClean" class="success-result">
              <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
              <div class="success-text">未检测到敏感词，文案合规</div>
            </div>

            <!-- 敏感词列表 -->
            <div v-if="result.sensitiveWords.length > 0" class="words-list">
              <div class="section-title">敏感词详情</div>
              <el-collapse v-model="activeWords">
                <el-collapse-item
                  v-for="(word, index) in result.sensitiveWords"
                  :key="index"
                  :name="index"
                >
                  <template #title>
                    <div class="word-item-title">
                      <el-tag type="danger" size="small">
                        {{ word.word }}
                      </el-tag>
                      <span class="word-category">{{ word.category }}</span>
                    </div>
                  </template>
                  <div class="word-detail">
                    <div class="detail-row">
                      <span class="detail-label">敏感词：</span>
                      <span class="detail-value danger">{{ word.word }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">分类：</span>
                      <span class="detail-value">{{ word.category }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">位置：</span>
                      <span class="detail-value">{{ word.position }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">替换建议：</span>
                      <span class="detail-value">{{ word.suggestion }}</span>
                    </div>
                    <el-button
                      type="primary"
                      size="small"
                      @click="replaceWord(index)"
                      style="margin-top: 12px"
                    >
                      替换此词
                    </el-button>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加敏感词 -->
    <el-card class="add-word-card">
      <template #header>
        <span>贡献敏感词到共享词库</span>
      </template>

      <el-form :inline="true" :model="addForm" class="add-word-form">
        <el-form-item>
          <el-input
            v-model="addForm.word"
            placeholder="输入要添加的敏感词"
            maxlength="50"
            show-word-limit
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="addForm.category"
            placeholder="选择分类"
            style="width: 180px"
          >
            <el-option
              v-for="cat in categories"
              :key="cat"
              :label="cat"
              :value="cat"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            :icon="Plus"
            :loading="addingWord"
            @click="handleAddWord"
          >
            添加到词库
          </el-button>
        </el-form-item>
      </el-form>

      <el-alert
        title="您的贡献"
        type="info"
        :closable="false"
        show-icon
      >
        您添加的敏感词将同步到所有用户的词库，感谢您的贡献！所有用户提交都将经过审核。
      </el-alert>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Search,
  Delete,
  CopyDocument,
  CircleCheckFilled,
  Plus
} from '@element-plus/icons-vue'
import { useWordLibStore } from '@/stores/wordLib'

const wordLibStore = useWordLibStore()

const inputText = ref('')
const result = ref(null)
const detecting = ref(false)
const activeWords = ref([])
const addForm = ref({
  word: '',
  category: ''
})
const addingWord = ref(false)

const categories = computed(() => wordLibStore.categories)

const sampleText = `这是第一顶级的产品，国家级品质保证！加我微信私聊，给你最优惠的价格。`

onMounted(() => {
  wordLibStore.syncWordLib()
})

function handleInput() {
  if (result.value) {
    result.value = null
  }
}

async function handleDetect() {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入要检测的文本')
    return
  }

  detecting.value = true
  try {
    result.value = await wordLibStore.performDetection(inputText.value)
    if (result.value.sensitiveWords.length > 0) {
      activeWords.value = Array.from(
        { length: result.value.sensitiveWords.length },
        (_, i) => i
      )
    }
  } catch (error) {
    ElMessage.error('检测失败：' + error.message)
  } finally {
    detecting.value = false
  }
}

function handleClear() {
  inputText.value = ''
  result.value = null
  activeWords.value = []
}

function loadSample() {
  inputText.value = sampleText
  handleInput()
}

async function pasteText() {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
    handleInput()
    ElMessage.success('已粘贴文本')
  } catch {
    ElMessage.warning('无法访问剪贴板，请手动粘贴')
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

function replaceWord(index) {
  const word = result.value.sensitiveWords[index]
  inputText.value = inputText.value.replaceAll(word.word, word.suggestion)
  result.value.sensitiveWords.splice(index, 1)
  result.value.processedText = inputText.value
  result.value.totalWords = result.value.sensitiveWords.length
  result.value.isClean = result.value.sensitiveWords.length === 0

  if (result.value.sensitiveWords.length === 0) {
    activeWords.value = []
  } else {
    activeWords.value = activeWords.value.filter(i => i !== index).map(i => i > index ? i - 1 : i)
  }

  ElMessage.success(`已将"${word.word}"替换为"${word.suggestion}"`)
}

async function handleAddWord() {
  if (!addForm.value.word.trim()) {
    ElMessage.warning('请输入敏感词')
    return
  }
  if (addForm.value.word.length < 2 || addForm.value.word.length > 50) {
    ElMessage.warning('敏感词长度必须在2-50个字符之间')
    return
  }
  if (!addForm.value.category) {
    ElMessage.warning('请选择分类')
    return
  }

  addingWord.value = true
  try {
    await wordLibStore.addAnonymousWord(addForm.value.word, addForm.value.category)
    ElMessage.success('添加成功！所有用户将自动同步')
    addForm.value = { word: '', category: '' }
    await wordLibStore.syncWordLib()
  } catch (error) {
    ElMessage.error('添加失败：' + error.message)
  } finally {
    addingWord.value = false
  }
}
</script>

<style scoped>
.detect-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-card :deep(.el-card__body),
.result-card :deep(.el-card__body) {
  padding: 20px;
}

.text-input :deep(.el-textarea__inner) {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.action-buttons .el-button {
  flex: 1;
}

.quick-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.quick-label {
  color: var(--color-text-secondary);
}

.empty-result {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-stats {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.stat-value.danger {
  color: var(--color-danger);
}

.processed-text {
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.text-preview {
  padding: 12px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  color: var(--color-text-regular);
  font-family: 'Courier New', monospace;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.success-result {
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  font-size: 64px;
  color: var(--color-success);
  margin-bottom: 16px;
}

.success-text {
  font-size: 16px;
  color: var(--color-success);
  font-weight: 600;
}

.words-list {
  margin-top: 16px;
}

.word-item-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.word-category {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.word-detail {
  padding: 12px 0;
}

.detail-row {
  display: flex;
  padding: 4px 0;
}

.detail-label {
  width: 80px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.detail-value {
  flex: 1;
  color: var(--color-text-regular);
  font-size: 12px;
}

.detail-value.danger {
  color: var(--color-danger);
  font-weight: 600;
}

.add-word-card :deep(.el-card__header) {
  background: var(--color-bg-secondary);
}

.add-word-form :deep(.el-form-item) {
  margin-bottom: 0;
}
</style>
<template>
  <div class="wordlib-container">
    <app-header />
    <main class="main-content">
      <el-container>
        <el-row :gutter="24" justify="center">
          <el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16">
            <el-card>
              <template #header>
                <div class="card-header">
                  <h2>词库管理</h2>
                  <div class="header-actions">
                    <el-button
                      type="primary"
                      :icon="Plus"
                      @click="showAddDialog = true"
                    >
                      添加敏感词
                    </el-button>
                    <el-button
                      :icon="Refresh"
                      @click="refreshWordLib"
                      :loading="loading"
                    >
                      刷新词库
                    </el-button>
                  </div>
                </div>
              </template>

              <!-- 搜索栏 -->
              <el-form :model="searchForm" class="search-form">
                <div class="search-row">
                  <el-form-item label="关键词" class="search-item">
                    <el-input
                      v-model="searchForm.keyword"
                      placeholder="搜索敏感词"
                      clearable
                      @keyup.enter="handleSearch"
                      class="search-input"
                    />
                  </el-form-item>
                  <el-form-item label="分类" class="search-item">
                    <el-select
                      v-model="searchForm.category"
                      placeholder="选择分类"
                      clearable
                      class="search-select"
                    >
                      <el-option
                        v-for="cat in categories"
                        :key="cat"
                        :label="cat"
                        :value="cat"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item class="search-item search-actions">
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                  </el-form-item>
                </div>
              </el-form>

              <!-- 添加新分类 -->
              <el-card class="add-category-card" shadow="hover">
                <template #header>
                  <div class="add-category-header">
                    <span>分类管理</span>
                  </div>
                </template>
                <div class="add-category-form">
                  <el-input
                    v-model="newCategoryName"
                    placeholder="输入新分类名称"
                    style="width: 300px; margin-right: 12px"
                    clearable
                    @keyup.enter="handleAddCategory"
                  />
                  <el-button 
                    type="primary" 
                    @click="handleAddCategory"
                    :loading="addingCategory"
                    :disabled="!newCategoryName.trim()"
                  >
                    添加分类
                  </el-button>
                </div>
                <div class="category-list" v-if="categories.length > 0">
                  <el-divider content-position="left">现有分类</el-divider>
                  <div class="category-tags">
                    <el-tag
                      v-for="cat in categories"
                      :key="cat"
                      closable
                      @close="handleDeleteCategory(cat)"
                      style="margin: 4px"
                    >
                      {{ cat }}
                    </el-tag>
                  </div>
                </div>
              </el-card>
              <el-card class="import-card" shadow="hover">
                <template #header>
                  <div class="import-header">
                    <span>批量导入敏感词</span>
                    <el-button type="text" @click="showImportHelp = !showImportHelp">
                      {{ showImportHelp ? '收起' : '使用说明' }}
                    </el-button>
                  </div>
                </template>
                
                <div v-if="showImportHelp" class="import-help">
                  <p>📝 <strong>支持以下分隔符：</strong></p>
                  <ul>
                    <li>换行符（每行一个词）</li>
                    <li>逗号（,）</li>
                    <li>分号（;）</li>
                    <li>顿号（、）</li>
                  </ul>
                  <p>💡 例如：<code>最低价,全网最低,史上最低</code></p>
                </div>

                <div class="import-form">
                  <el-input
                    v-model="importText"
                    type="textarea"
                    :rows="3"
                    placeholder="粘贴敏感词列表，用换行、逗号、分号或顿号分隔"
                    clearable
                  />
                  <el-select
                    v-model="importCategory"
                    placeholder="选择导入分类（必选）"
                    style="margin-top: 12px; width: 100%"
                  >
                    <el-option
                      v-for="cat in categories"
                      :key="cat"
                      :label="cat"
                      :value="cat"
                    />
                  </el-select>
                  <div class="import-actions">
                    <el-button 
                      type="primary" 
                      @click="handleBatchImport"
                      :loading="importing"
                      :disabled="!importText.trim() || !importCategory"
                    >
                      导入
                    </el-button>
                    <el-button @click="handleClearImport">清空</el-button>
                  </div>
                  <div v-if="importCount > 0" class="import-count">
                    ✅ 检测到 {{ importCount }} 个敏感词
                  </div>
                </div>
              </el-card>

              <!-- 词库统计 -->
              <div class="stats-row">
                <div class="stat-item">
                  <div class="stat-label">总词数</div>
                  <div class="stat-value">{{ totalWords }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">分类数</div>
                  <div class="stat-value">{{ categories.length }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">当前页</div>
                  <div class="stat-value">{{ currentPage }} / {{ totalPages }}</div>
                </div>
              </div>

              <!-- 词库列表 -->
              <div class="table-container" style="margin-top: 16px">
                <el-table
                  :data="words"
                  v-loading="loading"
                  stripe
                  :max-height="500"
                  :key="tableKey"
                >
                <el-table-column prop="word" label="敏感词" min-width="150" show-overflow-tooltip />
                <el-table-column prop="category" label="分类" width="120">
                  <template #default="{ row }">
                    <el-tag size="small" effect="light">{{ row.category }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="source" label="来源" width="100" show-overflow-tooltip />
                <el-table-column prop="createdBy" label="创建者" width="100" show-overflow-tooltip />
                <el-table-column label="创建时间" width="160">
                  <template #default="{ row }">
                    <span class="time-text">{{ formatDate(row.createdAt) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                  <template #default="{ row }">
                    <el-button
                      type="primary"
                      link
                      size="small"
                      @click="handleEdit(row)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="danger"
                      link
                      size="small"
                      @click="handleDelete(row)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
                </el-table>
              </div>

              <!-- 分页 -->
              <el-pagination
                :current-page="currentPage"
                :page-size="pageSize"
                :total="totalWords"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
                style="margin-top: 20px; justify-content: flex-end"
              />
            </el-card>
          </el-col>
        </el-row>
      </el-container>
    </main>

    <!-- 添加/编辑弹窗 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingWord ? '编辑敏感词' : '添加敏感词'"
      width="500px"
    >
      <el-form :model="wordForm" :rules="wordRules" ref="wordFormRef">
        <el-form-item label="敏感词" prop="word">
          <el-input
            v-model="wordForm.word"
            placeholder="请输入敏感词"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select
            v-model="wordForm.category"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <el-option
              v-for="cat in categories"
              :key="cat"
              :label="cat"
              :value="cat"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ editingWord ? '更新' : '添加' }}
        </el-button>
      </template>
    </el-dialog>

    <app-footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { useWordLibStore } from '@/stores/wordLib'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import dayjs from 'dayjs'

const wordLibStore = useWordLibStore()

const searchForm = ref({
  keyword: '',
  category: ''
})

const wordForm = ref({
  word: '',
  category: ''
})

const wordRules = {
  word: [
    { required: true, message: '请输入敏感词', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ]
}

const showAddDialog = ref(false)
const editingWord = ref(null)
const wordFormRef = ref(null)
const submitting = ref(false)
const tableKey = ref(0)

const importText = ref('')
const importCategory = ref('')
const importing = ref(false)
const showImportHelp = ref(true)

const newCategoryName = ref('')
const addingCategory = ref(false)

const importCount = computed(() => {
  if (!importText.value.trim()) return 0
  const words = importText.value
    .split(/[\n,，;；、]/)
    .map(w => w.trim())
    .filter(w => w.length >= 2)
  return words.length
})

const categories = computed(() => wordLibStore.categories)
const words = computed(() => wordLibStore.words)
const totalWords = computed(() => wordLibStore.totalWords)
const currentPage = computed(() => wordLibStore.currentPage)
const totalPages = computed(() => wordLibStore.totalPages)
const pageSize = computed(() => wordLibStore.pageSize)
const loading = computed(() => wordLibStore.loading)

onMounted(() => {
  loadWordLib()
})

async function loadWordLib() {
  await Promise.all([
    wordLibStore.syncWordLib(),
    wordLibStore.loadCategories(),
    loadWords()
  ])
}

async function loadWords() {
  await wordLibStore.loadWords(
    currentPage.value,
    pageSize.value,
    searchForm.value.category,
    searchForm.value.keyword
  )
  // 更新tableKey以强制表格重新渲染
  tableKey.value += 1
}

async function handleSearch() {
  wordLibStore.currentPage = 1
  await loadWords()
}

async function handleReset() {
  searchForm.value = {
    keyword: '',
    category: ''
  }
  await handleSearch()
}

function refreshWordLib() {
  loadWordLib()
}

function handleEdit(row) {
  editingWord.value = row
  wordForm.value = {
    word: row.word,
    category: row.category
  }
  showAddDialog.value = true
}

function handleDelete(row) {
  ElMessageBox.confirm(
    `确定要删除敏感词"${row.word}"吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // 将ID转换为字符串以避免精度丢失
      await wordLibStore.removeWord(row.id)
      ElMessage.success('删除成功')
      await loadWords() // 等待刷新完成
    } catch (error) {
      ElMessage.error('删除失败：' + error.message)
    }
  })
}

async function handleSubmit() {
  if (!wordFormRef.value) return

  try {
    await wordFormRef.value.validate()
    submitting.value = true

    if (editingWord.value) {
      // 直接传递ID，因为JavaScript会处理大整数
      await wordLibStore.changeWord(editingWord.value.id, wordForm.value.word, wordForm.value.category)
      ElMessage.success('更新成功')
    } else {
      await wordLibStore.addAnonymousWord(wordForm.value.word, wordForm.value.category)
      ElMessage.success('添加成功')
    }

    showAddDialog.value = false
    resetForm()
    await loadWords() // 等待刷新完成
  } catch (error) {
    if (error !== false) {
      ElMessage.error((editingWord.value ? '更新' : '添加') + '失败：' + error.message)
    }
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  wordForm.value = {
    word: '',
    category: ''
  }
  editingWord.value = null
  if (wordFormRef.value) {
    wordFormRef.value.resetFields()
  }
}

async function handleBatchImport() {
  if (!importText.value.trim() || !importCategory.value) {
    ElMessage.warning('请输入敏感词并选择分类')
    return
  }

  const words = importText.value
    .split(/[\n,，;；、]/)
    .map(w => w.trim())
    .filter(w => w.length >= 2)

  if (words.length === 0) {
    ElMessage.warning('未检测到有效敏感词（每个词至少2个字符）')
    return
  }

  importing.value = true
  
  try {
    const result = await wordLibStore.batchAddWords({
      wordsByCategory: {
        [importCategory.value]: words
      }
    })

    if (result.success) {
      ElMessage.success(`成功导入 ${result.added} 个敏感词${result.skipped > 0 ? `，跳过 ${result.skipped} 个已存在的词` : ''}`)
      handleClearImport()
      await loadWords()
    } else {
      ElMessage.error(result.message || '导入失败')
    }
  } catch (error) {
    ElMessage.error('导入失败：' + error.message)
  } finally {
    importing.value = false
  }
}

function handleClearImport() {
  importText.value = ''
  importCategory.value = ''
}

async function handleAddCategory() {
  if (!newCategoryName.value.trim()) {
    ElMessage.warning('请输入分类名称')
    return
  }

  addingCategory.value = true

  try {
    const result = await wordLibStore.addNewCategory(newCategoryName.value.trim())
    if (result.success) {
      ElMessage.success(result.message)
      newCategoryName.value = ''
      importCategory.value = ''
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    ElMessage.error('添加分类失败：' + error.message)
  } finally {
    addingCategory.value = false
  }
}

function handleDeleteCategory(categoryName) {
  ElMessageBox.confirm(
    `确定要删除分类"${categoryName}"吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const result = await wordLibStore.removeCategory(categoryName)
      if (result.success) {
        ElMessage.success(result.message)
      } else {
        ElMessage.error(result.message)
      }
    } catch (error) {
      ElMessage.error('删除分类失败：' + error.message)
    }
  }).catch(() => {
  })
}

async function handleSizeChange(size) {
  wordLibStore.pageSize = size
  wordLibStore.currentPage = 1
  await loadWords()
}

async function handlePageChange(page) {
  wordLibStore.currentPage = page
  await loadWords()
}

function formatDate(date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}
</script>

<style scoped>
.wordlib-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.main-content {
  flex: 1;
  padding: var(--spacing-xl) 0;
}

/* 主卡片样式 */
:deep(.el-card) {
  border-radius: var(--radius-lg);
  border: none;
  box-shadow: var(--shadow-md);
  background: var(--color-bg-primary);
  transition: box-shadow 0.3s ease;
}

:deep(.el-card:hover) {
  box-shadow: var(--shadow-lg);
}

:deep(.el-card__header) {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color-light);
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 搜索栏样式 */
.search-form {
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color-light);
}

.search-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
}

.search-item {
  flex: 1;
  min-width: 150px;
}

.search-input {
  width: 100%;
}

.search-select {
  width: 100%;
}

.search-actions {
  display: flex;
  gap: 8px;
  min-width: auto;
}

@media (max-width: 576px) {
  .search-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-item {
    width: 100%;
  }
  
  .search-actions {
    justify-content: flex-start;
  }
}

/* 统计卡片样式 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
}

.stat-item {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 24px 20px;
  border-radius: var(--radius-lg);
  text-align: center;
  border: 1px solid var(--border-color-light);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-light);
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 功能卡片样式 */
.add-category-card,
.import-card {
  margin-top: 20px;
  margin-bottom: 20px;
}

.add-category-header,
.import-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 15px;
}

.add-category-form {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-list {
  margin-top: 20px;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* 标签样式 */
:deep(.el-tag) {
  border-radius: var(--radius-md);
  padding: 8px 14px;
  font-weight: 500;
  border: none;
  transition: all 0.2s ease;
}

:deep(.el-tag:hover) {
  transform: scale(1.05);
}

/* 导入帮助样式 */
.import-help {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  padding: 18px 22px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.8;
  border: 1px solid #bfdbfe;
}

.import-help p {
  margin: 8px 0;
}

.import-help ul {
  margin: 12px 0;
  padding-left: 24px;
}

.import-help li {
  margin: 6px 0;
  color: var(--color-text-regular);
}

.import-help code {
  background: var(--color-bg-primary);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  color: var(--color-primary);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.import-form {
  margin-top: 16px;
}

.import-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.import-count {
  margin-top: 12px;
  color: var(--color-success);
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* 表格样式 */
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color-light);
}

:deep(.el-table) {
  border-radius: 0;
  border: none;
  min-width: 600px;
}

:deep(.el-table th) {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 12px;
  padding: 12px 8px;
}

:deep(.el-table td) {
  padding: 10px 8px;
  font-size: 13px;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: #f8fafc;
}

:deep(.el-table__row:hover td) {
  background: #f1f5f9 !important;
}

@media (max-width: 576px) {
  :deep(.el-table th),
  :deep(.el-table td) {
    padding: 8px 6px;
    font-size: 12px;
  }
  
  :deep(.el-button--text) {
    padding: 4px 8px;
    font-size: 12px;
  }
}

.time-text {
  font-size: 13px;
  color: var(--color-text-secondary);
}

/* 分页样式 */
:deep(.el-pagination) {
  margin-top: 24px;
  justify-content: flex-end;
  padding: 8px 0;
}

:deep(.el-pager li.is-active) {
  background: var(--color-primary);
  color: white;
}

/* 按钮样式优化 */
:deep(.el-button--primary) {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  border: none;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 分割线样式 */
:deep(.el-divider--horizontal) {
  margin: 24px 0;
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
}

:deep(.el-dialog__header) {
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--border-color-light);
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__footer) {
  padding: 16px 24px 24px;
  border-top: 1px solid var(--border-color-light);
}
</style>
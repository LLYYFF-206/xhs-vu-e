import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getLatestLib,
  getStats,
  getCategories,
  addCategory as apiAddCategory,
  deleteCategory as apiDeleteCategory,
  detectWords,
  addWordAnonymous,
  getWords,
  deleteWord,
  updateWord,
  batchAddWords as apiBatchAddWords
} from '@/api/wordLib'

export const useWordLibStore = defineStore('wordLib', () => {
  const wordLib = ref({})
  const categories = ref([])
  const stats = ref({})
  const words = ref([])
  const totalWords = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const totalPages = ref(0)
  const loading = ref(false)
  const lastUpdateTime = ref(null)

  const totalCount = computed(() => {
    return Object.values(wordLib.value).reduce((sum, words) => sum + words.length, 0)
  })

  async function syncWordLib() {
    loading.value = true
    try {
      const response = await getLatestLib()
      if (response.code === 0) {
        wordLib.value = response.data.categories
        lastUpdateTime.value = response.data.updateTime
           // ✅ 这两行就是你缺的！！加上就显示了！
      totalWords.value = response.data.totalCount
      categories.value = response.data.categoryList || []
        return true
      }
      return false
    } catch (error) {
      console.error('同步失败:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function loadStats() {
    try {
      const response = await getStats()
      if (response.code === 0) {
        stats.value = response.data
        return true
      }
      return false
    } catch (error) {
      console.error('加载统计失败:', error)
      return false
    }
  }

  async function loadCategories() {
    try {
      const response = await getCategories()
      if (response.code === 0) {
        categories.value = response.data
        return true
      }
      return false
    } catch (error) {
      console.error('加载分类失败:', error)
      return false
    }
  }

  async function addNewCategory(name) {
    try {
      const response = await apiAddCategory({ name })
      if (response.code === 0) {
        await loadCategories()
        return { success: true, message: response.msg }
      }
      return { success: false, message: response.msg }
    } catch (error) {
      console.error('添加分类失败:', error)
      return { success: false, message: error.message }
    }
  }

  async function removeCategory(name) {
    try {
      const response = await apiDeleteCategory(name)
      if (response.code === 0) {
        await loadCategories()
        return { success: true, message: response.msg }
      }
      return { success: false, message: response.msg }
    } catch (error) {
      console.error('删除分类失败:', error)
      return { success: false, message: error.message }
    }
  }

  async function performDetection(text) {
    try {
      const response = await detectWords({ text })
      if (response.code === 0) {
        return response.data
      }
      throw new Error(response.msg)
    } catch (error) {
      console.error('检测失败:', error)
      throw error
    }
  }

  async function addAnonymousWord(word, category) {
    try {
      const response = await addWordAnonymous({ word, category })
      if (response.code === 0) {
        return true
      }
      throw new Error(response.msg)
    } catch (error) {
      console.error('添加失败:', error)
      throw error
    }
  }

  async function loadWords(page = 1, size = 20, category = '', keyword = '') {
    loading.value = true
    try {
      const response = await getWords(page, size, category, keyword)
      if (response.code === 0) {
        words.value = response.data.data
        totalWords.value = response.data.total
        currentPage.value = response.data.page + 1 // 后端返回0基，前端使用1基
        pageSize.value = response.data.size
        totalPages.value = response.data.totalPages
        return true
      }
      return false
    } catch (error) {
      console.error('加载词库失败:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function removeWord(id) {
    try {
      const response = await deleteWord(id)
      if (response.code === 0) {
        return true
      }
      throw new Error(response.msg)
    } catch (error) {
      console.error('删除失败:', error)
      throw error
    }
  }

  async function changeWord(id, word, category) {
    try {
      const response = await updateWord(id, { word, category })
      if (response.code === 0) {
        return true
      }
      throw new Error(response.msg)
    } catch (error) {
      console.error('更新失败:', error)
      throw error
    }
  }

  async function batchAddWords(wordsByCategory) {
    try {
      const response = await apiBatchAddWords(wordsByCategory)
      if (response.code === 0) {
        const data = response.data || {}
        await syncWordLib()
        return {
          success: true,
          added: data.added || 0,
          skipped: data.skipped || 0,
          message: `成功添加 ${data.added || 0} 个，跳过 ${data.skipped || 0} 个已存在的词`
        }
      }
      throw new Error(response.msg)
    } catch (error) {
      console.error('批量添加失败:', error)
      return {
        success: false,
        message: error.message || '批量添加失败'
      }
    }
  }

  function clearCache() {
    wordLib.value = {}
    stats.value = {}
    words.value = []
    lastUpdateTime.value = null
  }

  return {
    wordLib,
    categories,
    stats,
    words,
    totalWords,
    currentPage,
    pageSize,
    totalPages,
    loading,
    lastUpdateTime,
    totalCount,
    syncWordLib,
    loadStats,
    loadCategories,
    addNewCategory,
    removeCategory,
    performDetection,
    addAnonymousWord,
    loadWords,
    removeWord,
    changeWord,
    batchAddWords,
    clearCache
  }
})

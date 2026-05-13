import request from './auth'

export const getLatestLib = () => request.get('/wordLib/latest-lib')
export const getStats = () => request.get('/wordLib/stats')
export const getCategories = () => request.get('/wordLib/categories')
export const addCategory = (data) => request.post('/wordLib/categories', data)
export const deleteCategory = (name) => request.post('/wordLib/categories/delete', { name })
export const detectWords = (data) => request.post('/wordLib/detect', data)
export const addWordAnonymous = (data) => request.post('/wordLib/add-word-anonymous', data)
export const getWords = (page, size, category, keyword) => {
  const params = { page: page - 1, size }
  if (category) params.category = category
  if (keyword) params.keyword = keyword
  return request.get('/wordLib/words', { params })
}
export const deleteWord = (id) => request.delete(`/wordLib/words/${id}`)
export const updateWord = (id, data) => request.put(`/wordLib/words/${id}`, data)
export const batchAddWords = (data) => request.post('/wordLib/batch-add', data)
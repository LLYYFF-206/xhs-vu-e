import axios from 'axios'

// 自定义JSON解析器，处理大整数精度问题
const jsonParser = (text) => {
  return JSON.parse(text, (key, value) => {
    if (key === 'id' && typeof value === 'number') {
      return String(value)
    }
    return value
  })
}

const api = axios.create({
  // ✅ 这里改成你正确的域名！
  baseURL: 'https://collins-mph-dive-arc.xxx.com/api',
  timeout: 60000,
  // 自定义响应解析器，防止大整数精度丢失
  transformResponse: [(data) => {
    if (typeof data === 'string') {
      try {
        return jsonParser(data)
      } catch {
        return data
      }
    }
    return data
  }]
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API请求失败:', error)
    return Promise.reject(error)
  }
)

export default api

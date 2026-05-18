import axios from 'axios'

// 自定义JSON解析器，处理大整数精度问题
const jsonParser = (text) => {
  return JSON.parse(text, (key, value) => {
    if (key === 'id' && typeof value === 'number') {
      // 如果ID在解析时变成了number，可能已经丢失精度了
      return String(value)
    }
    return value
  })
}

const api = axios.create({
baseURL: 'https://collins-mph-dive-architects.trycloudflare.com',
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

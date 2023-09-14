import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  timeout: 1000*20
})

service.interceptors.request.use(
  (config) => {
    // config.headers.userId = sessionStorage.getItem('userId') || store.state.userId || ''
    // config.headers['Content-Type'] = 'application/json;charset=utf-8'
    // config.headers.token = sessionStorage.getItem('token') || store.state.token || ''
    return config
  },
  error => {
    // 错误
    console.log(error)
  }
)

service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      const { code, message } = response.data
      if (code === 1) {
        return response
      } else if (code === 2) {
        // 登录
        Message.warning(message)
        return response
      } else {
        Message.error(message)
        return response
      }
    } else {
      Message.error(response.status + response.statusText)
      return response
    }
  },
  error => {
    Message.error(error.message)
  }
)

function getFormData(params) {
  const formData = new FormData()
  Object.keys(params).forEach((item) => {
    formData.append(item, params[item])
  })
  return formData
}

export const list = (host, data) => service.post(host+'/api/file/list', JSON.stringify(data))  

export const upload = (host, data) => service.post(host+'/api/file/upload', getFormData(data), { headers: { 'Content-Type': 'multipart/form-data'}})

export const foldSize = (host, params) => service.get(host+'/api/file/foldSize', {params: params})
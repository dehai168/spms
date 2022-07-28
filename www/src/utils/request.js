import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import Cookies from 'js-cookie'
import defaultSetting from '@/settings'
import {
  getToken
} from '@/utils/auth'

if (process.env.NODE_ENV === "development") {
  document.cookie = `JSESSIONID=66601ECAFD6280CB38023B9DD0594DA7`
}
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    const token = getToken();
    if (token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.url += '&token=' + token;
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.redirect_url) {
      window.location.href = res.redirect_url
    } else {
      if (res.code !== 200) {
        let msg = ''
        if (res.code === 998) {
          msg = '您的license已经过期!请联系供应商解决!'
        } else if (res.code === 201) {
          msg = res.reason
        } else {
          msg = '服务器内部错误'
        }
        Message({
          message: msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        return res
      }
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
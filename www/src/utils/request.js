import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import Cookies from 'js-cookie'
import defaultSetting from '@/settings'
import { getToken } from '@/utils/auth'

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

    config.headers[defaultSetting.csrfTokenName] = Cookies.get('csrfToken')
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['u-token'] = getToken()
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
        Message({
          message: res.data || 'Error',
          type: 'error',
          duration: 5 * 1000
        })

        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
          // to re-login
          MessageBox.confirm('您已经被注销，您可以继续留在当前页面或是重新登录！', '注销确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }
        if (res.code === 998) {
          MessageBox.confirm('您的license已经过期!请联系供应商解决!', '提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {})
            .catch(() => {})
        }
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

import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import { getDynamicMap } from './const/map'
import '@/icons' // icon
import '@/permission' // permission control

import MyCard from './views/specialIndustries/hotel/hotelBase/MyCard.vue'
import Detail from './components/Detail'

Vue.use(ElementUI, {
  size: 'mini',
})
Vue.component('my-card', MyCard)
Vue.component('Detail', Detail)
Vue.config.productionTip = false
Vue.prototype.$succ = () => {
  ElementUI.Notification({
    title: '提示',
    message: '操作成功',
    type: 'success'
  })
}
Vue.prototype.$error = () => {
  ElementUI.Notification({
    title: '提示',
    message: '出错了',
    type: 'error'
  })
}
Vue.prototype.$map = getDynamicMap
getDynamicMap().then(res => {
  console.log(res)
  Vue.prototype.$map = res
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from 'echarts/charts'
import { PieChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent, GridComponent, DatasetComponent, TransformComponent, LegendComponent } from 'echarts/components'
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, DatasetComponent, TransformComponent, LegendComponent, BarChart, PieChart, LabelLayout, UniversalTransition, CanvasRenderer])

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
  size: 'mini'
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
Vue.prototype.$echarts = echarts;
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

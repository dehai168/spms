import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import SubLayout from '@/layout/sub-index'
import HomeLayout from '@/layout/home-index'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: [1,2,3]    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/table',
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: '表格', icon: 'el-icon-school' }
  //     }
  //   ]
  // },
  // 一级路由
  {
    path: '/',
    component: Layout,
    redirect: '/home',
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/index',
  },
  {
    path: '/basicinfo',
    component: Layout,
    redirect: '/basicinfo/specialindustries/hotel/base',
  },
  {
    path: '/analysis',
    component: Layout,
    redirect: '/analysis/focusareas',
  },
  {
    path: '/datacount',
    component: Layout,
    redirect: '/datacount/index',
  },
  // 二级路由
  {
    path: '/home',
    component: HomeLayout,
    children: [
      {
        path: 'index',
        name: 'Home',
        component: () => import("@/views/home/index"),
      }
    ]
  },
  {
    path: '/basicinfo',
    component: Layout,
    meta: { title: '基础信息管理', icon: 'el-icon-s-claim' },
    redirect: '/basicinfo/specialindustries',
    children: [
      {
        path: 'specialindustries',
        meta: { title: '特种行业', icon: 'el-icon-office-building' },
        component: SubLayout,
        redirect: '/basicinfo/specialindustries/hotel',
        children: [
          {
            path: 'hotel',
            meta: { title: '旅馆业', icon: 'el-icon-table-lamp' },
            component: SubLayout,
            redirect: '/basicinfo/specialindustries/hotel/base',
            children: [
              {
                path: 'base',
                name: 'base',
                component: () => import('@/views/specialIndustries/hotel/hotelBase/index'),
                meta: { title: '旅馆信息', icon: 'el-icon-table-lamp' }
              },
              {
                path: 'domestic',
                name: 'domestic',
                component: () => import('@/views/specialIndustries/hotel/domesticTraveler/index'),
                meta: { title: '境内旅客', icon: 'el-icon-user-solid' }
              },
              {
                path: 'overseas',
                name: 'overseas',
                component: () => import('@/views/specialIndustries/hotel/overseasTraveler/index'),
                meta: { title: '境外旅客', icon: 'el-icon-user' }
              }
            ]
          },
          {
            path: 'fleatrade',
            name: 'fleatrade',
            component: () => import('@/views/specialIndustries/fleaTrade/index'),
            meta: { title: '旧货交易', icon: 'el-icon-delete' }
          },
          {
            path: 'vehiclerepair',
            name: 'vehiclerepair',
            component: () => import('@/views/specialIndustries/vehicleRepair/index'),
            meta: { title: '机动车修理业', icon: 'el-icon-s-tools' }
          },
          {
            path: 'scrapMetal',
            name: 'scrapMetal',
            component: () => import('@/views/specialIndustries/scrapMetal/index'),
            meta: { title: '废旧金属回收', icon: 'el-icon-goods' }
          },
          {
            path: 'seal',
            meta: { title: '公章刻制业', icon: 'el-icon-s-check' },
            component: SubLayout,
            redirect: '/basicinfo/specialindustries/seal/list',
            children: [
              {
                path: 'list',
                name: 'list',
                component: () => import('@/views/specialIndustries/seal/list/index'),
                meta: { title: '公章管理', icon: 'el-icon-s-check' }
              },
              {
                path: 'record',
                name: 'record',
                component: () => import('@/views/specialIndustries/seal/record/index'),
                meta: { title: '公章备案管理', icon: 'el-icon-s-check' }
              }
            ]
          },
        ]
      },
      {
        path: 'entertainment-places',
        meta: { title: '娱乐场所', icon: 'el-icon-mic' },
        component: SubLayout,
        redirect: '/basicinfo/entertainment-places/ktv',
        children: [
          {
            path: 'ktv',
            component: () => import('@/views/entertainmentPlaces/ktv/index'),
            meta: { title: 'KTV', icon: 'el-icon-mic' },
          },
          {
            path: 'bar',
            component: () => import('@/views/entertainmentPlaces/bar/index'),
            meta: { title: '酒吧', icon: 'el-icon-goblet' },
          },
        ]
      },
      {
        path: 'employees',
        meta: { title: '要素采集', icon: 'el-icon-s-custom' },
        component: SubLayout,
        redirect: '/basicinfo/employees/domestic',
        children: [
          {
            path: 'domestic',
            component: () => import('@/views/employees/domestic/index'),
            meta: { title: '国内从业人员', icon: 'el-icon-user-solid' },
          },
          {
            path: 'overseas',
            component: () => import('@/views/employees/overseas/index'),
            meta: { title: '境外从业人员', icon: 'el-icon-user' },
          },
        ]
      },
    ]
  },
  {
    path: '/analysis',
    component: Layout,
    meta: { title: '智能研判分析', icon: 'el-icon-data-analysis' },
    children: [
      {
        path: 'focusareas',
        name: 'focusareas',
        component: () => import('@/views/focusAreas/index'),
        meta: { title: '重点地区管理', icon: 'el-icon-s-shop' }
      },
      {
        path: 'focustarget',
        name: 'focustarget',
        component: () => import('@/views/focusTarget/index'),
        meta: { title: '重点关注对象管理', icon: 'el-icon-s-cooperation' }
      },
      {
        path: 'earlywarn',
        name: 'earlywarn',
        component: () => import('@/views/earlyWarn/index'),
        meta: { title: '预警查询', icon: 'el-icon-search' }
      }
    ]
  },
  {
    path: '/datacount',
    component: Layout,
    meta: { title: '数据统计分析', icon: 'el-icon-s-data' },
    children: [
      {
        path: 'index',
        name: 'Index',
        meta: { title: '分析', icon: 'el-icon-school' },
        component: () => import("@/views/datacount/index"),
      }
    ]
  },
  // TODO  添加页面路由
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

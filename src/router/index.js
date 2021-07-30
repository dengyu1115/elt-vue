import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const routes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/base',
    component: Layout,
    meta: {
      title: '基础',
      icon: 'plane',
      keepAlive: true
    },
    children: [
      {
        path: 'workdayList',
        name: '工作日',
        component: () => import('@/views/base/WorkdayList'),
        meta: {
          title: '工作日',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/item',
    component: Layout,
    meta: {
      title: '项目',
      icon: 'plane',
      keepAlive: true
    },
    children: [
      {
        path: 'itemList',
        name: '项目列表',
        component: () => import('@/views/item/ItemList'),
        meta: {
          title: '项目列表'
        }
      },
      {
        path: 'groupList',
        name: '分组管理',
        component: () => import('@/views/item/GroupList'),
        meta: {
          title: '分组管理'
        }
      },
      {
        path: 'itemGroup',
        name: '项目分组',
        component: () => import('@/views/item/ItemGroup'),
        meta: {
          title: '项目分组'
        }
      },
      {
        path: 'klineList',
        name: 'K线列表',
        component: () => import('@/views/item/KlineList'),
        meta: {
          title: 'K线列表'
        }
      },
      {
        path: 'netList',
        name: '净值列表',
        component: () => import('@/views/item/NetList'),
        meta: {
          title: '净值列表'
        }
      },
      {
        path: 'scaleList',
        name: '基金规模',
        component: () => import('@/views/item/ScaleList'),
        meta: {
          title: '基金规模'
        }
      },
      {
        path: 'kline',
        name: 'K线',
        component: () => import('@/views/item/Kline'),
        meta: {
          title: 'K线'
        }
      },
      {
        path: 'lineIndustry',
        name: '折线图',
        component: () => import('@/views/item/LineIndustry'),
        meta: {
          title: '折线图'
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: routes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

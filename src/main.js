// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import request from '@/utils/request'
import echarts from 'echarts'
import axios from 'axios'
import '@/icons' // icon
import '@/permission' // permission control

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.prototype.$echarts = echarts

Vue.prototype.req = request

Vue.config.productionTip = false

Vue.prototype.$post = (url, param) => {
  return new Promise(resolve => {
    axios
      .post(url, JSON.stringify(param), {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
      .then(response => {
        if (response.data.code && response.data.code === '0') {
          resolve(response.data.data)
        } else {
          Vue.prototype.$message.error(response.data.msg)
        }
      })
      .catch(response => {
        Vue.prototype.$message.error('访问失败')
      })
  })
}

Vue.prototype.amount = (row, column, value, index) => {
  if (value) {
    if (value > 100000000) {
      return (Math.round(value / 10000) / 10000).toFixed(4) + '亿'
    } else if (value > 10000) {
      return (Math.round(value) / 10000).toFixed(4) + '万'
    }
    return (Math.round(value * 10000) / 10000).toFixed(4) + '元'
  }
}

Vue.prototype.net = (row, column, value, index) => {
  if (value) {
    return (Math.round(value * 10000) / 10000).toFixed(4)
  }
}

Vue.prototype.percent = (row, column, value, index) => {
  if (value) {
    return (Math.round(value * 10000) / 10000).toFixed(2) + '%'
  }
}

Vue.prototype.hundred = (row, column, value, index) => {
  if (value) {
    return (Math.round(value * 10000) / 100).toFixed(2) + '%'
  }
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

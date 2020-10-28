import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'element-ui/lib/theme-chalk/index.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import axios from 'axios'
import moment from 'moment'

import treeTable from 'vue-table-with-tree-grid'

Vue.use(VueQuillEditor /* { default global options } */)
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 为请求拦截器设置请求头
axios.interceptors.request.use(config => {
// Do something before request is sent
// console.log(config)
// 为config对象挂载Authorization属性
  config.headers.Authorization = sessionStorage.token
  return config
}, error => {
// Do something with request error
  return Promise.reject(error)
})
// 时间处理过滤器
Vue.filter('dateFormat', (val, format) => {
  return moment(val).format(format)
})

Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.component('tree-table', treeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

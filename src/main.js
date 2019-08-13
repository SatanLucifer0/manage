import Vue from 'vue'
import App from './App.vue'
// 导入全局基础样式
import './assets/css/base.less'

// 导入饿了么UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)



// ------------------------------------------------------------
// 导入组件
import login from './components/login.vue'
import index from './components/index.vue'




// 导入路由
import VueRouter from 'vue-router'
Vue.use(VueRouter)



// 注册路由,(设置路由规则)
const routes = [
  { path: '/login', component: login },
  { path: '/index', component: index }
]


// 创建路由
const router = new VueRouter({
  routes
})



Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 挂载路由
  router
}).$mount('#app')

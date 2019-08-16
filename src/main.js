import Vue from 'vue'
import App from './App.vue'
// 导入全局基础样式
import './assets/css/base.less'

// 导入饿了么UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

// 导入axios
// import axios from 'axios'
// Vue.prototype.$axios=axios;
// axios.defaults.baseURL='http://localhost:8888/api/private/v1/'
// 多个地方要用到,,axios抽取


// 导入组件
// import login from './components/login.vue'
// import index from './components/index.vue'





// 接收 router.js 暴露出来的router变量 
import router from './router/router'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 挂载路由
  router
}).$mount('#app')

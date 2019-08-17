import Vue from 'vue'


// 导入组件
import login from '../components/login.vue'
import index from '../components/index.vue'
import users from "../components/userlist.vue"


// 导入路由
import VueRouter from 'vue-router'
Vue.use(VueRouter)




// 注册路由,(设置路由规则)
const routes = [
  { path: '/login', component: login },
  { path: "", redirect: '/index' },
  {
    path: '/index', component: index,
    children: [
      {path:'/users',component:users}
    ]
  }
]


// 创建路由
const router = new VueRouter({
  routes
})


// 全局导航守卫
router.beforeEach((to, from, next) => {

  //判断哪个页面需要守卫,,这里是主页
  if (to.path.indexOf('index') != -1) {

    // 判断是否有登录
    if (window.localStorage.getItem('token')) {
      next()

    } else {

      Vue.prototype.$message.error('请先登录')
      router.push('/login')
    }
  } else {
    next()
  }
})

export default router
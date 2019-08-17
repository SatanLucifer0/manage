


// 1.导入axios
import axios from 'axios'
// Vue.prototype.$axios=axios;
// axios.defaults.baseURL='http://localhost:8888/api/private/v1/'


// 2. 多个基地址
const http = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1/',
});





// axios请求拦截,,拦截后给请求添加一个请求头再发送出去
// 默认的请求拦截,给请求默认加一个Authorization的键，它的值为token
// http.defaults.headers.common['Authorization'] = window.localStorage.getItem('token');

http.interceptors.request.use(function (config) {

  config.headers.Authorization=window.localStorage.getItem('token');

  return config;
}, function (error) {
  
  //发生错误的回调函数 
  return Promise.reject(error);
});




// 3.把http暴露出去
export default http

// 专门封装一个用来登录的方法
// 这个代表调用此方法必须传入一个对象，并且对象必须要有username和password两个属性
// 封装的好处：以后万一十个地方要发这个请求，那么十个地方只要调用这个方法就行了
// 万一以后地址变了，只要改这里，其他十个地方都变了
export const login = ({ userName, password }) => {
  return http.post('login', {
    username: userName,
    password,
  })
}

// 获取左侧菜单栏
export const menus = () => {

  return http.get('menus', {
    // headers: {

    //   Authorization: window.localStorage.getItem('token')

    // }
  })

}

// 请求用户数据李标
export const users = ({query, pagenum, pagesize}) => {
  return http.get('users', {
    //如果get提交法额参数不是写在网址上,那么必须写在一个 params 对象里
    params: {
      query,
      pagenum,
      pagesize,
    },
    // headers: {
    //   Authorization: window.localStorage.getItem('token')
    // }
  })
}


// 增加新用户
export const addUser=({password,username,email,mobile})=>{
    return http.post('users',{
      password,
      username,
      email,
      mobile,
    })
}





// 1.导入axios
import axios from 'axios'
// Vue.prototype.$axios=axios;
// axios.defaults.baseURL='http://localhost:8888/api/private/v1/'


// 2. 多个基地址
const http = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1/',
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


export const menus = () => {

  return http.get('menus', {
    headers: {

      Authorization: window.localStorage.getItem('token')
      
    }
  })

}

import request from '@/utils/request'
import qs from 'qs'

interface User {
  phone: string
  password: string
}

export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },

    // 1. 如果 data 是对象，则 content-type 是 application/json
    // 2. 如果 data 是 qs.stringify(data) 转换之后的数据：key=value&key=value，则 content-type 为 application/x-www-form-urlencoded
    // 3. 如果 data 是 FormData 对象，则 content-type 是 multipart/form-data
    data: qs.stringify(data) // axios 默认发送的是 application/json 格式的数据
  })
}

export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}

export const getUserPages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

export const forbidUser = (userId: string | number) => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    params: {
      userId
    }
  })
}

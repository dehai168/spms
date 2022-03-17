import request from '@/utils/request'

export function authcode(params) {
  // return request({
  //   url: '/auth/authcode',
  //   method: 'get',
  //   params
  // })
  return new Promise((res, rej) => {
    res({
      code: 200,
      data: ''
    })
  })
}
export function login(data) {
  // return request({
  //   url: '/auth/login',
  //   method: 'post',
  //   data
  // })
  return new Promise((res, rej) => {
    res({
      code: 200,
      data: {
        result: 'tokenstr',
        error: 0
      }
    })
  })
}
export function logout(params) {
  // return request({
  //   url: '/auth/logout',
  //   method: 'get',
  //   params
  // })
  return new Promise((res, rej) => {
    res({
      code: 200,
      data: true
    })
  })
}
export function pwdvalid(data) {
  // return request({
  //   url: '/auth/pwdvalid',
  //   method: 'post',
  //   data
  // })
  return new Promise((res, rej) => {
    res({
      code: 200,
      data: true
    })
  })
}
export function changepwd(data) {
  // return request({
  //   url: '/auth/changepwd',
  //   method: 'put',
  //   data
  // })
  return new Promise((res, rej) => {
    res({
      code: 200,
      data: true
    })
  })
}

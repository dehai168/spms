import request from '@/utils/request'

export function authcode(params) {
  return request({
    url: '/auth/authcode',
    method: 'get',
    params
  })
}
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}
export function logout(params) {
  return request({
    url: '/auth/logout',
    method: 'get',
    params
  })
}
export function pwdvalid(data) {
  return request({
    url: '/auth/pwdvalid',
    method: 'post',
    data
  })
}
export function changepwd(data) {
  return request({
    url: '/auth/changepwd',
    method: 'put',
    data
  })
}

import request from '@/utils/request'

export function whoami(token) {
  return request({
    url: '/user/whoami',
    method: 'get',
    params: { token }
  })
}
// and so
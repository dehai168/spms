import request from '@/utils/request'

export function items(params) {
  const {
    pagesize: size,
    pageindex: index,
    ...data
  } = params;
  return request({
    url: '/police/hotel/domestic/list',
    method: 'post',
    params: {
      size,
      index
    },
    data
  })
}
export function homoclinicsitems(params) {
  const {
    pagesize: size,
    pageindex: index,
    alarmid,
  } = params;
  return request({
    url: '/police/hotel/domestic/homoclinics',
    method: 'get',
    params: {
      size,
      index,
      alarmid,
    }
  })
}
import request from '@/utils/request'


export function items(params) {
  const { pagesize: size, pageindex: index, ...data } = params;
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


import request from '@/utils/request'


export function enumsItems(data) {
  return request({
    url: '/police/enums/list',
    method: 'post',
    data
  })
}
import request from '@/utils/request'


export function enumsItems(data) {
  return request({
    url: '/police/enums/list',
    method: 'post',
    data
  })
}
export function getEnterpriseList(params) {
  return request({
    url: '/police/enterprise/search/list',
    method: 'get',
    params
  })
}
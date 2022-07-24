import request from '@/utils/request'
import toQueryString from '@/utils/toQueryString'

export default {
    dailyCheckList: (query = {},data = {}) => request.post(toQueryString(`/police/enterprise/dailycheck/list`,query),data),
    caseList:  (query = {},data = {}) => request.get(toQueryString(`/police/enterprise/case/list`,query)),
    goodsList:  (query = {},data = {}) => request.get(toQueryString(`/police/enterprise/goods/list`,query)),
}
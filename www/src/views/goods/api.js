import request from '@/utils/request'
import toQueryString from '@/utils/toQueryString'

export default {
    list: (query = {},data = {}) => request.post(toQueryString(`/police/goods/list`,query),data),
    add: (data = {}) => request.post('/police/goods/add',data),
    update: (data = {}) => request.post('/police/goods/update',data),
    delete: (query = {}) => request.get(toQueryString('/police/goods/delete',query)),
    getEnterpriseInfo: (query = {}) => request.get(toQueryString(`/police/enterprise/list`,query))
}
import request from '@/utils/request'
import toQueryString from '@/utils/toQueryString'

export default {
    list: (query = {},data = {}) => request.post(toQueryString(`/police/case/list`,query),data),
    add: (data = {}) => request.post('/police/case/add',data),
    update: (data = {}) => request.post('/police/case/update',data),
    delete: (query = {}) => request.get(toQueryString('/police/case/delete',query)),
}
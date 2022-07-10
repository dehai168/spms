import request from '@/utils/request'
import toQueryString from '@/utils/toQueryString'

export default {
    list: (query = {},data = {}) => request.post(toQueryString(`/police/unlock/list`,query),data),
    add: (data = {}) => request.post('/police/unlock/add',data),
    update: (data = {}) => request.post('/police/unlock/update',data),
    delete: (query = {}) => request.get(toQueryString('/police/unlock/delete',query)),
}
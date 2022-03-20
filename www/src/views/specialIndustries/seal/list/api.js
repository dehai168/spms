import request from '@/utils/request'
import toQueryString from '@/utils/toQueryString'

export default {
    list: (query = {},data = {}) => request.post(toQueryString(`/police/sealengrave/list`,query),data),
    add: (data = {}) => request.post('/police/sealengrave/add',data),
    update: (data = {}) => request.post('/police/sealengrave/update',data),
    delete: (query = {}) => request.get(toQueryString('/police/sealengrave/delete',query)),
}
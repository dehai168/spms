import request from '@/utils/request'
import toQueryString from '@/utils/toQueryString'

export default {
    list: (query = {},data = {}) => request.post(toQueryString(`/police/pawn/list`,query),data),
    add: (data = {}) => request.post('/police/pawn/add',data),
    update: (data = {}) => request.post('/police/pawn/update',data),
    delete: (query = {}) => request.get(toQueryString('/police/pawn/delete',query)),
}
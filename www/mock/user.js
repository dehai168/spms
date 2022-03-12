const Mock = require('mockjs')

module.exports = [{
    url: '/user/whoami',
    type: 'get',
    response: config => {
        return {
            code: 20000,
            data: {
                userid: 1,
                username: 'admin',
                role: 1,
                sex: '男',
                age: 20,
                state: 1,
                remark: ''
            }
        }
    }
}, ]